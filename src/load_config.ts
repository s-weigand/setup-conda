import * as core from '@actions/core'

export interface ConfigObject {
  update_conda: boolean
  python_version: string
  os: string
}

export const loadConfig = (): ConfigObject => {
  const update_conda = core.getInput('update-conda') === 'true'
  const python_version = core.getInput('python-version')
  const os = process.platform
  return {
    update_conda,
    python_version,
    os
  }
}
