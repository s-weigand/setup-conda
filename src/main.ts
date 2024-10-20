import { setFailed } from "@actions/core";
import { setup_conda } from "./conda_actions";
import { loadConfig } from "./load_config";

async function run(): Promise<void> {
  try {
    const config = loadConfig();
    await setup_conda(config);
  } catch (error) {
    if (typeof error === "string") {
      setFailed(error);
    } else if (error instanceof Error) {
      setFailed(error.message);
    }
  }
}

run();
