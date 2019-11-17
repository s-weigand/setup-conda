import * as core from '@actions/core'
import { loadConfig } from './load_config'
import { download_miniconda, install_conda } from './download'
import { init_conda } from './init_conda'

async function run(): Promise<void> {
  try {
    const config = loadConfig()

    if (config.redownload) {
      await download_miniconda(config)
      await install_conda(config)
    }
    init_conda()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
