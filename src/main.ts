import * as core from '@actions/core'
import { loadConfig } from './load_config'
import { setup_conda } from './conda_actions'

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    await setup_conda(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

/* tslint:disable-next-line:no-floating-promises */
run()
