import * as core from '@actions/core'

export interface ConfigObject {
  update_conda: boolean
  python_version: string
  conda_channels: string[]
  os: string
}

/**
 * Read the values of the inputs and operating system.
 */
export const loadConfig = (): ConfigObject => {
  const update_conda = core.getInput('update-conda') === 'true'
  const python_version = core.getInput('python-version')
  const conda_channels = core
    .getInput('conda-channels')
    .replace(' ', '')
    .split(',')
  const os = process.platform
  return {
    update_conda,
    python_version,
    conda_channels,
    os
  }
}
