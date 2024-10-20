import { loadConfig } from "../src/load_config";

const testEnvVars = {
  "INPUT_ACTIVATE-CONDA": "true",
  "INPUT_UPDATE-CONDA": "true",
  "INPUT_PYTHON-VERSION": "default",
  "INPUT_CONDA-CHANNELS": "  conda-forge, anaconda   , bioconda",
};

describe("Reading of the config", () => {
  beforeEach(() => {
    for (const key in testEnvVars) {
      process.env[key] = testEnvVars[key as keyof typeof testEnvVars];
    }

    process.stdout.write = jest.fn();
  });

  afterEach(() => {
    for (const key in testEnvVars) Reflect.deleteProperty(testEnvVars, key);
  });

  it("test config values", () => {
    const config = loadConfig();
    expect(config.activate_conda).toEqual(true);
    expect(config.update_conda).toEqual(true);
    expect(config.python_version).toEqual("default");
    expect(config.conda_channels).toEqual(["conda-forge", "anaconda", "bioconda"]);
    expect(config.os).toEqual(process.platform);
  });

  it("no channels", () => {
    process.env["INPUT_CONDA-CHANNELS"] = "";
    const config = loadConfig();
    expect(config.conda_channels).toEqual([]);
  });
});
