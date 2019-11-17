import * as core from '@actions/core'
import { loadConfig } from './load_config'
import { download_miniconda, install_conda } from './download'

async function run(): Promise<void> {
  try {
    const config = loadConfig()

    await download_miniconda(config)
    await install_conda(config)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
