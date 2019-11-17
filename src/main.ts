import * as core from '@actions/core'
import { loadConfig } from './load_config'
import { init_conda } from './init_conda'

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    await init_conda(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

/* tslint:disable-next-line:no-floating-promises */
run()
