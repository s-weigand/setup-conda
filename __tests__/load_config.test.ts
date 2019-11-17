import { loadConfig } from '../src/load_config'
import * as core from '@actions/core'

const testEnvVars = {
  'INPUT_CONDA-VERSION': 'latest',
  'INPUT_PYTHON-VERSION': 'default'
}

describe('Reading of the config', () => {
  beforeEach(() => {
    for (const key in testEnvVars) {
      process.env[key] = testEnvVars[key as keyof typeof testEnvVars]
    }

    process.stdout.write = jest.fn()
  })

  afterEach(() => {
    for (const key in testEnvVars) Reflect.deleteProperty(testEnvVars, key)
  })

  it('test config values', () => {
    const config = loadConfig()
    expect(config.conda_version).toEqual('latest')
    expect(config.python_version).toEqual('default')
    expect(config.os).toEqual(process.platform)
  })
})
