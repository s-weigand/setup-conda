import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'
import * as temp from 'temp'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

import { ConfigObject } from './load_config'

/**
 * Sets up conda to be later used.
 *
 * @param config Configuration of the action
 */
export const setup_conda = async (config: ConfigObject): Promise<void> => {
  const initialPythonLocation = await get_python_location()
  await addCondaToPath(config)
  await activate_conda(config)
  await chown_conda_macOs(config)
  await add_conda_channels(config)
  await update_conda(config)
  await install_python(config)
  await activate_conda(config)
  await reset_base_python(config, initialPythonLocation)
}

/**
 * Only add path_to_add to the PATH variable if it exists
 *
 * @param path_to_add Path to add to the PATH variable
 */
const sane_add_path = (path_to_add: string): void => {
  if (fs.existsSync(path_to_add)) {
    core.addPath(path_to_add)
  }
}

/**
 * Adds the bin dirs of default Python or Conda to Path
 *
 * @param python_dist_dir Root directory of a Python dist dir
 * @param config Configuration of the action
 */
const add_bin_dir = (python_dist_dir: string, config: ConfigObject): void => {
  if (config.os === 'win32') {
    sane_add_path(path.join(python_dist_dir, 'Scripts'))
    sane_add_path(path.join(python_dist_dir, 'Library', 'bin'))
    sane_add_path(path.join(python_dist_dir, 'usr', 'Library', 'bin'))
    sane_add_path(path.join(python_dist_dir, 'mingw-w64', 'Library', 'bin'))
  } else {
    sane_add_path(path.join(python_dist_dir, 'bin'))
  }
}

/**
 * Add the conda main dir and the binary dir to the path variable.
 *
 * @param config Configuration of the action
 */
const addCondaToPath = async (config: ConfigObject): Promise<void> => {
  console.log(`Adding conda path to path: ${process.env.CONDA}`)
  const conda_base_path = process.env.CONDA as string
  sane_add_path(conda_base_path)
  add_bin_dir(conda_base_path, config)
}

/**
 * Activates the conda base env.
 *
 * @param config Configuration of the action
 */
const activate_conda = async (config: ConfigObject): Promise<void> => {
  console.log('Activating conda base')
  if (config.os === 'win32') {
    await exec.exec('activate.bat', ['base'])
  } else {
    // write temp shell script to activate conda
    temp.track()
    const stream = temp.createWriteStream({ suffix: '.sh' })
    stream.write('source activate base')
    stream.end()
    await exec.exec('bash', [stream.path as string])
  }
}

const get_python_location = async (): Promise<string> => {
  let pythonLocation = ''

  const options = { listeners: {} }
  options.listeners = {
    stdout: (data: Buffer) => {
      console.log('stdout', data.toString())
      pythonLocation += data.toString()
    }
  }
  await exec.exec('which', ['python'], options)
  return pythonLocation
}

/**
 * Sets the python version back to the default version
 *
 * @param config Configuration of the action
 */
const reset_base_python = async (
  config: ConfigObject,
  initialPythonLocation: string
): Promise<void> => {
  if (config.activate_conda !== true) {
    let pythonLocation = ''
    if (process.env.pythonLocation) {
      console.log('Using ')
      pythonLocation = process.env.pythonLocation
    } else {
      pythonLocation = path.normalize(path.join(initialPythonLocation, '..'))

      if (config.os === 'win32') {
        pythonLocation = pythonLocation.replace(/^\\c/, 'C:')
      }
    }
    console.log('Resetting Python to default version at:')
    console.log(pythonLocation)
    sane_add_path(pythonLocation)
    add_bin_dir(pythonLocation, config)
  }
}

/**
 * Adds channels to the configuration of conda.
 *
 * @param config Configuration of the action
 */
const add_conda_channels = async (config: ConfigObject): Promise<void> => {
  for (let channel of config.conda_channels) {
    if (channel !== '') {
      console.log('Adding conda-channels')
      await exec.exec('conda', ['config', '--add', 'channels', channel])
    }
  }
}

/**
 * This is to prevent a bug not allowing to install
 * conda packages on the maxOs runner,
 * since the config and miniconda belong to a different user.
 *
 * @param config Configuration of the action
 */
const chown_conda_macOs = async (config: ConfigObject): Promise<void> => {
  if (config.os === 'darwin') {
    console.log('Changing owner of conda folders')
    const config_path = path.join(process.env.HOME as string, '.conda')
    const user_name = process.env.USER
    await exec.exec('sudo', ['chown', '-R', `${user_name}:staff`, config_path])
    await exec.exec('sudo', [
      'chown',
      '-R',
      `${user_name}:staff`,
      process.env.CONDA as string
    ])
  }
}

/**
 * Updates conda itself.
 *
 * @param config Configuration of the action
 */
const update_conda = async (config: ConfigObject): Promise<void> => {
  if (config.update_conda) {
    console.log('Updating conda')
    await exec.exec('conda', [
      'update',
      '-y',
      '-n',
      'base',
      '-c',
      'defaults',
      'conda'
    ])
  }
}

/**
 * Installs a the python version specified in inputs.
 *
 * @param config Configuration of the action
 */
const install_python = async (config: ConfigObject): Promise<void> => {
  const python_version = config.python_version
  if (python_version !== 'default') {
    console.log(`Installing python ${config.python_version}`)
    if (python_version.match(/^\d+\.\d+(\.\d+)?$/) !== null) {
      await exec.exec('conda', [
        'install',
        '-y',
        `python=${config.python_version}`
      ])
    } else {
      throw new Error(
        [
          `The value of "python-version" you provided was ${python_version}, which is invalid.`,
          'The value of "python-version" needs to be of form:',
          /^\d+\.\d+(\.\d+)?$/
        ].join(os.EOL)
      )
    }
  }
}
