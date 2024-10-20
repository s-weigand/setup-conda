import { existsSync } from "node:fs";
import { EOL } from "node:os";
import { join, normalize } from "node:path";
import { addPath, endGroup, exportVariable, startGroup } from "@actions/core";
import { exec } from "@actions/exec";

import type { ConfigObject } from "./load_config";

/**
 * Sets up conda to be later used.
 *
 * @param config Configuration of the action
 */
export const setup_conda = async (config: ConfigObject): Promise<void> => {
  const initialPythonLocation = await get_python_location();
  await addCondaToPath(config);
  // await activate_conda(config)
  await chown_conda_macOs(config);
  await add_conda_channels(config);
  await update_conda(config);
  await install_python(config);
  await activate_conda(config);
  await reset_base_python(config, initialPythonLocation);
};

/**
 * Only add path_to_add to the PATH variable if it exists
 *
 * @param path_to_add Path to add to the PATH variable
 */
const sane_add_path = (path_to_add: string): void => {
  if (existsSync(path_to_add)) {
    addPath(path_to_add);
  }
};

/**
 * Adds the bin dirs of default Python or Conda to Path
 *
 * @param python_dist_dir Root directory of a Python dist dir
 * @param config Configuration of the action
 */
const add_bin_dir = (python_dist_dir: string, config: ConfigObject): void => {
  if (config.os === "win32") {
    sane_add_path(join(python_dist_dir, "mingw-w64", "Library", "bin"));
    sane_add_path(join(python_dist_dir, "usr", "Library", "bin"));
    sane_add_path(join(python_dist_dir, "Library", "bin"));
    sane_add_path(join(python_dist_dir, "Scripts"));
  } else {
    sane_add_path(join(python_dist_dir, "bin"));
  }
};

/**
 * Add the conda main dir and the binary dir to the path variable.
 *
 * @param config Configuration of the action
 */
export const addCondaToPath = async (config: ConfigObject): Promise<void> => {
  startGroup("Adding conda path to PATH");
  console.log("The CONDA env var is:", process.env.CONDA);
  const conda_base_path = process.env.CONDA;
  let errorMessageAppendix: string[] = [];
  if (conda_base_path === undefined) {
    if (config.os === "darwin" && process.env.ImageOS !== undefined) {
      const macImageVersion = Number(process.env.ImageOS.replace("macos", ""));
      if (macImageVersion > 12) {
        errorMessageAppendix = [
          'MacOS images newer than "macos-12" (i.e. "macOS-latest") are known to be ' +
            "incompatible with this action due to a missing miniconda installation.",
          "See: https://github.com/s-weigand/setup-conda/issues/432",
        ];
      }
    }
    throw new Error(
      [
        "Could not determine conda base path, it seams conda is not installed.",
        ...errorMessageAppendix,
      ].join(EOL),
    );
  }
  sane_add_path(conda_base_path);
  add_bin_dir(conda_base_path, config);
  endGroup();
};

interface ParsedActivationScript {
  condaPaths: string[];
  envVars: { [name: string]: string };
}

/**
 * Parse `conda shell.<shell_name> activate <env_name>`scripts outputs
 *
 * @param activationStr Output of the activation script
 * @param envExport Prefix to which is used to export an env variable
 * @param osPathSep Character to separate path in the PATH variable
 * @returns condaPaths
 */
export const parseActivationScriptOutput = async (
  activationStr: string,
  envExport: string,
  osPathSep: string,
): Promise<ParsedActivationScript> => {
  let condaPaths: string[] = [];
  const envVars: { [name: string]: string } = {};
  const lines = activationStr.split(envExport);
  for (const line of lines) {
    if (line.startsWith("PATH")) {
      const paths = line.replace(/PATH\s?=|'|"|\n|\s/g, "").split(osPathSep);
      condaPaths = paths
        .filter((path) => path.toLowerCase().indexOf("miniconda") !== -1)
        .filter(
          (orig, index, self) => index === self.findIndex((subSetItem) => subSetItem === orig),
        );
    } else {
      // eslint-disable-next-line prefer-const
      let [varName, varValue] = line.replace(/\s?=\s?/g, "=").split("=");

      if (varValue !== undefined && varName !== "CONDA_SHLVL") {
        varValue = varValue.replace(/('|")?\r?\n$/gm, "").replace(/^'|"/gm, "");
        envVars[`${varName}`] = varValue;
      }
    }
  }
  return { condaPaths, envVars };
};

/**
 * Activates the conda base env by changing the path and env variables.
 *
 * @param config Configuration of the action
 */
const activate_conda = async (config: ConfigObject): Promise<void> => {
  const condaEnvName = config.python_version === "default" ? "base" : "__setup_conda";
  startGroup(`Activating conda ${condaEnvName}`);
  let parsedActivationScript: ParsedActivationScript;
  let activationStr = "";

  const options = { listeners: {} };
  options.listeners = {
    stdout: (data: Buffer) => {
      activationStr = data.toString();
    },
  };
  console.log("Conda activate script:");
  if (config.os === "win32") {
    await exec("conda", ["shell.powershell", "activate", condaEnvName], options);
    parsedActivationScript = await parseActivationScriptOutput(activationStr, "$Env:", ";");
  } else {
    await exec("conda", ["shell.bash", "activate", condaEnvName], options);
    parsedActivationScript = await parseActivationScriptOutput(activationStr, "export ", ":");
  }
  const condaPaths = parsedActivationScript.condaPaths.sort((a, _) => a.indexOf("envs"));
  console.log("\n\nData used for activation:\n", {
    condaPaths,
    envVars: parsedActivationScript.envVars,
  });
  for (const condaPath of condaPaths) {
    sane_add_path(condaPath);
  }
  for (const [varName, varValue] of Object.entries(parsedActivationScript.envVars)) {
    exportVariable(varName, varValue);
  }
  endGroup();
};

const get_python_location = async (): Promise<string> => {
  startGroup("Getting original pythonLocation");
  let pythonLocation = "";

  const options = { listeners: {} };
  options.listeners = {
    stdout: (data: Buffer) => {
      pythonLocation = data.toString();
    },
  };
  await exec("which", ["python"], options);
  endGroup();
  return pythonLocation;
};

/**
 * Sets the python version back to the default version
 *
 * @param config Configuration of the action
 */
const reset_base_python = async (
  config: ConfigObject,
  initialPythonLocation: string,
): Promise<void> => {
  if (config.activate_conda !== true) {
    startGroup("Resetting Python:");
    let pythonLocation = "";
    if (process.env.pythonLocation) {
      pythonLocation = process.env.pythonLocation;
    } else {
      pythonLocation = normalize(join(initialPythonLocation, ".."));

      if (config.os === "win32") {
        pythonLocation = pythonLocation.replace(/^\\c/, "C:");
      }
    }
    console.log("Using python at: ", pythonLocation);
    sane_add_path(pythonLocation);
    add_bin_dir(pythonLocation, config);
  }
  endGroup();
};

/**
 * Adds channels to the configuration of conda.
 *
 * @param config Configuration of the action
 */
const add_conda_channels = async (config: ConfigObject): Promise<void> => {
  if (config.conda_channels.length !== 0) {
    startGroup("Adding conda-channels:");
    for (const channel of config.conda_channels) {
      if (channel !== "") {
        console.log("Adding: ", channel);
        await exec("conda", ["config", "--add", "channels", channel]);
      }
    }
    endGroup();
  }
};

/**
 * This is to prevent a bug not allowing to install
 * conda packages on the maxOs runner,
 * since the config and miniconda belong to a different user.
 *
 * @param config Configuration of the action
 */
const chown_conda_macOs = async (config: ConfigObject): Promise<void> => {
  if (config.os === "darwin") {
    console.log("Changing owner of conda folders");
    const config_path = join(process.env.HOME as string, ".conda");
    const user_name = process.env.USER;
    await exec("sudo", ["chown", "-R", `${user_name}:staff`, config_path]);
    await exec("sudo", ["chown", "-R", `${user_name}:staff`, process.env.CONDA as string]);
  }
};

/**
 * Updates conda itself.
 *
 * @param config Configuration of the action
 */
const update_conda = async (config: ConfigObject): Promise<void> => {
  if (config.update_conda) {
    startGroup("Updating conda:");
    await exec("conda", ["update", "-y", "-n", "base", "-c", "defaults", "conda"]);
    endGroup();
  }
};

/**
 * Create conda environment for Python or PyPy.
 *
 * @param requested_pyver Requested Python/PyPy version
 */
const create_conda_env = async (requested_pyver: string): Promise<void> => {
  await exec("conda", ["create", "-y", "-n", "__setup_conda", requested_pyver]);
};

/**
 * Installs the python version specified in inputs.
 *
 * @param config Configuration of the action
 */
const install_python = async (config: ConfigObject): Promise<void> => {
  const { python_version } = config;
  if (python_version !== "default") {
    startGroup(`Installing conda python ${config.python_version}`);
    if (python_version.match(/^\d+\.\d+(\.\d+)?$/) !== null) {
      await create_conda_env(`python=${config.python_version}`);
    } else if (python_version.match(/^pypy(([23]\.\d+)?(=(\d+)?(\.\d+)?(\.\d+)?)?)?$/) !== null) {
      await create_conda_env(config.python_version);
    } else {
      throw new Error(
        [
          `The value of "python-version" you provided was ${python_version}, which is invalid.`,
          'The value of "python-version" needs to be of form:',
          /^\d+\.\d+(\.\d+)?$/,
          "(for Python) or",
          /^pypy(([23]\.\d+)?(=(\d+)?(\.\d+)?(\.\d+)?)?)?$/,
          "(for PyPy and PyPy3)",
        ].join(EOL),
      );
    }
    endGroup();
  }
};
