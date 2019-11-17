import * as core from '@actions/core'

export interface ConfigObject {
  conda_version: string
  python_version: string
  os: string
}

export const loadConfig = (): ConfigObject => {
  const conda_version = core.getInput('conda-version', {
    required: true
  })
  const python_version = core.getInput('python-version', {
    required: true
  })
  const os = process.platform
  return {
    conda_version: conda_version,
    python_version: python_version,
    os: os
  }
}
