import * as path from 'path'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

import { ConfigObject } from './load_config'

function binDir(installDir: string, config: ConfigObject): string {
  if (config.os === 'win32') {
    return path.join(installDir, 'Scripts')
  } else {
    return path.join(installDir, 'bin')
  }
}

export const init_conda = async (config: ConfigObject): Promise<void> => {
  await addCondaToPath(config)
  await activate_conda(config)
}

const addCondaToPath = async (config: ConfigObject): Promise<void> => {
  console.log(`Adding conda path to path: ${process.env.CONDA}`)
  const conda_base_path = process.env.CONDA as string
  const bin_dir = binDir(conda_base_path, config)
  core.addPath(conda_base_path)
  core.addPath(bin_dir)
}

const activate_conda = async (config: ConfigObject): Promise<void> => {
  if (config.os === 'win32') {
    await exec.exec('activate.bat', ['base'])
  } else {
    await exec.exec('bash', ['src/activate_conda.sh'])
  }
}
