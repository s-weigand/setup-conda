import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import { ConfigObject } from './load_config'

export function wait(milliseconds: number) {
  return new Promise(resolve => {
    if (isNaN(milliseconds)) {
      throw new Error('milleseconds not a number')
    }

    setTimeout(() => resolve('done!'), milliseconds)
  })
}

interface InstallCommand {
  command: string
  options: string[]
}

interface CondaInstructions {
  download_url: (conda_version: string) => string
  local_path: 'Miniconda3.exe' | '~/miniconda.sh'
  install_cmd: InstallCommand
}

const condaInstructionsWin: CondaInstructions = {
  download_url: conda_version =>
    `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Windows-x86_64.exe`,
  local_path: 'Miniconda3.exe',
  install_cmd: {
    command: 'start',
    options: [
      '/wait',
      '""',
      'Miniconda3.exe',
      '/InstallationType=JustMe',
      '/RegisterPython=0',
      '/S',
      '/D=%UserProfile%Miniconda3'
    ]
  }
}

const condaInstructionsOsX: CondaInstructions = {
  download_url: conda_version =>
    `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Linux-x86_64.sh`,
  local_path: '~/miniconda.sh',
  install_cmd: {
    command: 'bash',
    options: ['~/miniconda.sh', '-b', '-p', '$HOME/miniconda']
  }
}

const condaInstructionsLinux: CondaInstructions = {
  download_url: conda_version =>
    `https://repo.anaconda.com/miniconda/Miniconda3-${conda_version}-Linux-x86_64.sh`,
  local_path: '~/miniconda.sh',
  install_cmd: {
    command: 'bash',
    options: ['~/miniconda.sh', '-b', '-p', '$HOME/miniconda']
  }
}

export const get_instructions = (config: ConfigObject): CondaInstructions => {
  if (config.os === 'win32') {
    return condaInstructionsWin
  } else if (config.os === 'darwin') {
    return condaInstructionsOsX
  } else {
    return condaInstructionsLinux
  }
}

export const download_miniconda = async (
  config: ConfigObject
): Promise<void> => {
  const instruction = get_instructions(config)
  const download_url = instruction.download_url(config.conda_version)
  const minconda_download_path = await tc.downloadTool(download_url)
  await io.mv(minconda_download_path, instruction.local_path)
}

export const install_conda = async (config: ConfigObject): Promise<void> => {
  const instruction = get_instructions(config)
  const command = instruction.install_cmd.command
  const option = instruction.install_cmd.options
  await exec.exec(command, option)
}
