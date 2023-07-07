import * as fs from 'fs'
import * as path from 'path'
import { parseActivationScriptOutput } from '../src/conda_actions'

describe('Parse env activation output', () => {
  it('Parse linux activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/linux_conda_bash_activation.sh'),
      )
      .toString('utf8')
    const { condaPaths, envVars } = await parseActivationScriptOutput(
      activationStr,
      'export ',
      ':',
    )
    expect(condaPaths.length).toBe(3)
    expect(envVars['CONDA_PREFIX']).toBe(
      '/usr/share/miniconda/envs/__setup_conda',
    )
    expect(envVars).not.toHaveProperty('CONDA_SHLVL')
    expect(envVars['CONDA_DEFAULT_ENV']).toBe('__setup_conda')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toBe('(__setup_conda) ')
    expect(envVars['CONDA_EXE']).toBe('/usr/share/miniconda/bin/conda')
    expect(envVars['_CE_M']).toBe('')
    expect(envVars['_CE_CONDA']).toBe('')
    expect(envVars['CONDA_PYTHON_EXE']).toBe('/usr/share/miniconda/bin/python')
  })
  it('Parse macOs activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/mac_conda_bash_activation.sh'),
      )
      .toString('utf8')
    const { condaPaths, envVars } = await parseActivationScriptOutput(
      activationStr,
      'export ',
      ':',
    )
    expect(condaPaths.length).toBe(3)
    expect(envVars['CONDA_PREFIX']).toBe(
      '/usr/local/miniconda/envs/__setup_conda',
    )
    expect(envVars).not.toHaveProperty('CONDA_SHLVL')
    expect(envVars['CONDA_DEFAULT_ENV']).toBe('__setup_conda')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toBe('(__setup_conda) ')
    expect(envVars['CONDA_EXE']).toBe('/usr/local/miniconda/bin/conda')
    expect(envVars['_CE_M']).toBe('')
    expect(envVars['_CE_CONDA']).toBe('')
    expect(envVars['CONDA_PYTHON_EXE']).toBe('/usr/local/miniconda/bin/python')
  })
  it('Parse windows activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/windows_conda_powershell_activation.ps1'),
      )
      .toString('utf8')
    const { condaPaths, envVars } = await parseActivationScriptOutput(
      activationStr,
      '$Env:',
      ';',
    )
    expect(condaPaths.length).toBe(9)
    expect(envVars['CONDA_PREFIX']).toBe('C:\\Miniconda\\envs\\__setup_conda')
    expect(envVars).not.toHaveProperty('CONDA_SHLVL')
    expect(envVars['CONDA_DEFAULT_ENV']).toBe('__setup_conda')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toBe('(__setup_conda) ')
    expect(envVars['CONDA_EXE']).toBe('C:\\Miniconda\\Scripts\\conda.exe')
    expect(envVars['_CE_M']).toBe('')
    expect(envVars['_CE_CONDA']).toBe('')
    expect(envVars['CONDA_PYTHON_EXE']).toBe('C:\\Miniconda\\python.exe')
  })
})
