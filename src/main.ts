import { setFailed } from '@actions/core'
import { loadConfig } from './load_config'
import { setup_conda } from './conda_actions'

async function run(): Promise<void> {
  try {
    const config = loadConfig()
    await setup_conda(config)
  } catch (error) {
    if (typeof error === 'string') {
      setFailed(error)
    } else if (error instanceof Error) {
      setFailed(error.message)
    }
  }
}

run()
