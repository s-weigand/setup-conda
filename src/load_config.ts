import * as core from '@actions/core'

export interface ConfigObject {
  activate_conda: boolean
  update_conda: boolean
  python_version: string
  conda_channels: string[]
  os: string
}

/**
 * Read the values of the inputs and operating system.
 */
export const loadConfig = (): ConfigObject => {
  const activate_conda = core.getInput('activate-conda') === 'true'
  const update_conda = core.getInput('update-conda') === 'true'
  const python_version = core.getInput('python-version')
  const conda_channels = core
    .getInput('conda-channels')
    .replace(' ', '')
    .split(',')
    .filter((channel) => channel !== '')
  const os = process.platform
  return {
    activate_conda,
    update_conda,
    python_version,
    conda_channels,
    os,
  }
}
