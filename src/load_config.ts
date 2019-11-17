import * as core from '@actions/core'

export interface ConfigObject {
  python_version: string
  os: string
}

export const loadConfig = (): ConfigObject => {
  const python_version = core.getInput('python-version', {
    required: true
  })
  const os = process.platform
  return {
    python_version: python_version,
    os: os
  }
}
