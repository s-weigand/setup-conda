import { readFileSync } from "node:fs";
import { EOL } from "node:os";
import { resolve } from "node:path";
import { addCondaToPath, parseActivationScriptOutput } from "../src/conda_actions";

describe("Parse env activation output", () => {
  it("Parse linux activation", async () => {
    const activationStr = readFileSync(
      resolve(__dirname, "data/linux_conda_bash_activation.sh"),
    ).toString("utf8");
    const { condaPaths, envVars } = await parseActivationScriptOutput(
      activationStr,
      "export ",
      ":",
    );
    expect(condaPaths.length).toBe(3);
    expect(envVars.CONDA_PREFIX).toBe("/usr/share/miniconda/envs/__setup_conda");
    expect(envVars).not.toHaveProperty("CONDA_SHLVL");
    expect(envVars.CONDA_DEFAULT_ENV).toBe("__setup_conda");
    expect(envVars.CONDA_PROMPT_MODIFIER).toBe("(__setup_conda) ");
    expect(envVars.CONDA_EXE).toBe("/usr/share/miniconda/bin/conda");
    expect(envVars._CE_M).toBe("");
    expect(envVars._CE_CONDA).toBe("");
    expect(envVars.CONDA_PYTHON_EXE).toBe("/usr/share/miniconda/bin/python");
  });
  it("Parse macOs activation", async () => {
    const activationStr = readFileSync(
      resolve(__dirname, "data/mac_conda_bash_activation.sh"),
    ).toString("utf8");
    const { condaPaths, envVars } = await parseActivationScriptOutput(
      activationStr,
      "export ",
      ":",
    );
    expect(condaPaths.length).toBe(3);
    expect(envVars.CONDA_PREFIX).toBe("/usr/local/miniconda/envs/__setup_conda");
    expect(envVars).not.toHaveProperty("CONDA_SHLVL");
    expect(envVars.CONDA_DEFAULT_ENV).toBe("__setup_conda");
    expect(envVars.CONDA_PROMPT_MODIFIER).toBe("(__setup_conda) ");
    expect(envVars.CONDA_EXE).toBe("/usr/local/miniconda/bin/conda");
    expect(envVars._CE_M).toBe("");
    expect(envVars._CE_CONDA).toBe("");
    expect(envVars.CONDA_PYTHON_EXE).toBe("/usr/local/miniconda/bin/python");
  });
  it("Parse windows activation", async () => {
    const activationStr = readFileSync(
      resolve(__dirname, "data/windows_conda_powershell_activation.ps1"),
    ).toString("utf8");
    const { condaPaths, envVars } = await parseActivationScriptOutput(activationStr, "$Env:", ";");
    expect(condaPaths.length).toBe(9);
    expect(envVars.CONDA_PREFIX).toBe("C:\\Miniconda\\envs\\__setup_conda");
    expect(envVars).not.toHaveProperty("CONDA_SHLVL");
    expect(envVars.CONDA_DEFAULT_ENV).toBe("__setup_conda");
    expect(envVars.CONDA_PROMPT_MODIFIER).toBe("(__setup_conda) ");
    expect(envVars.CONDA_EXE).toBe("C:\\Miniconda\\Scripts\\conda.exe");
    expect(envVars._CE_M).toBe("");
    expect(envVars._CE_CONDA).toBe("");
    expect(envVars.CONDA_PYTHON_EXE).toBe("C:\\Miniconda\\python.exe");
  });
});

const testConfig = {
  activate_conda: false,
  update_conda: false,
  python_version: "",
  conda_channels: [],
  os: "linux",
};

describe("Throw error if CONDA env var isn't set", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it.each(["linux", "win32", "darwin"])("General error %p", async (os: string) => {
    await expect(addCondaToPath({ ...testConfig, os })).rejects.toThrow(
      "Could not determine conda base path, it seams conda is not installed.",
    );
  });

  it("MacOs > 12 error", async () => {
    process.env.ImageOS = "macos13";
    await expect(addCondaToPath({ ...testConfig, os: "darwin" })).rejects.toThrow(
      [
        "Could not determine conda base path, it seams conda is not installed.",
        'MacOS images newer than "macos-12" (i.e. "macOS-latest") are known to be ' +
          "incompatible with this action due to a missing miniconda installation.",
        "See: https://github.com/s-weigand/setup-conda/issues/432",
      ].join(EOL),
    );
  });
});
