import * as path from 'path'
import * as core from '@actions/core'

const IS_WINDOWS = process.platform === 'win32'
// Miniconda has "scripts" or "bin" directories where command-line tools that come with packages are installed.
// This is where pip is, along with anything that pip installs.
// There is a seperate directory for `pip install --user`.
//
// For reference, these directories are as follows:
//   macOS / Linux:
//      <sys.prefix>/bin (by default /usr/local/bin, but not on hosted agents -- see the `else`)
//      (--user) ~/.local/bin
//   Windows:
//      <Miniconda installation dir>\Scripts
//      (--user) %APPDATA%\Python\PythonXY\Scripts
// See https://docs.python.org/3/library/sysconfig.html

function binDir(installDir: string): string {
  if (IS_WINDOWS) {
    return path.join(installDir, 'Scripts')
  } else {
    return path.join(installDir, 'bin')
  }
}

export const init_conda = () => {
  console.log(`process.env.CONDA: ${process.env.CONDA}`)
  const conda_base_path = process.env.CONDA as string
  const bin_dir = binDir(conda_base_path)
  core.addPath(conda_base_path)
  core.addPath(bin_dir)
}
