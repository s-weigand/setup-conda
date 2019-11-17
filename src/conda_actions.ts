import * as path from 'path'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

import { ConfigObject } from './load_config'

const binDir = (installDir: string, config: ConfigObject): string => {
  if (config.os === 'win32') {
    return path.join(installDir, 'Scripts')
  } else {
    return path.join(installDir, 'bin')
  }
}

export const setup_conda = async (config: ConfigObject): Promise<void> => {
  await addCondaToPath(config)
  await activate_conda(config)
  await update_conda(config)
  await install_python(config)
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

const update_conda = async (config: ConfigObject): Promise<void> => {
  if (config.update_conda) {
    await exec.exec('conda', ['update', '-y', 'conda'])
  }
}

const install_python = async (config: ConfigObject): Promise<void> => {
  if (config.python_version !== 'default') {
    await exec.exec('conda', [
      'install',
      '-y',
      `python=${config.python_version}`
    ])
  }
}
