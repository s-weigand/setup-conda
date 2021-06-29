import * as fs from 'fs'
import * as path from 'path'
import {
  parseActivationScriptOutput,
  ParsedActivationScriptOutput,
} from '../src/conda_actions'

describe('Parse evn activation output', () => {
  it('Parse linux activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/linux_conda_bash_activation.sh')
      )
      .toString('utf8')
    const result: ParsedActivationScriptOutput =
      await parseActivationScriptOutput(activationStr, 'export ', ':')
    const { condaPaths, envVars } = result
    expect(condaPaths.length).toBe(3)
    expect(envVars['CONDA_PREFIX']).toEqual('/usr/share/miniconda')
    expect(envVars['CONDA_SHLVL']).toEqual('1')
    expect(envVars['CONDA_DEFAULT_ENV']).toEqual('base')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toEqual('(base)')
    expect(envVars['CONDA_EXE']).toEqual('/usr/share/miniconda/bin/conda')
    expect(envVars['_CE_M']).toEqual('')
    expect(envVars['_CE_CONDA']).toEqual('')
    expect(envVars['CONDA_PYTHON_EXE']).toEqual(
      '/usr/share/miniconda/bin/python'
    )
  })
  it('Parse macOs activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/mac_conda_bash_activation.sh')
      )
      .toString('utf8')
    const result: ParsedActivationScriptOutput =
      await parseActivationScriptOutput(activationStr, 'export ', ':')
    const { condaPaths, envVars } = result
    expect(condaPaths.length).toBe(3)
    expect(envVars['CONDA_PREFIX']).toEqual('/usr/local/miniconda')
    expect(envVars['CONDA_SHLVL']).toEqual('1')
    expect(envVars['CONDA_DEFAULT_ENV']).toEqual('base')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toEqual('(base)')
    expect(envVars['CONDA_EXE']).toEqual('/usr/local/miniconda/bin/conda')
    expect(envVars['_CE_M']).toEqual('')
    expect(envVars['_CE_CONDA']).toEqual('')
    expect(envVars['CONDA_PYTHON_EXE']).toEqual(
      '/usr/local/miniconda/bin/python'
    )
  })
  it('Parse windows activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/windows_conda_powershell_activation.ps1')
      )
      .toString('utf8')
    const result: ParsedActivationScriptOutput =
      await parseActivationScriptOutput(activationStr, '$Env:', ';')
    const { condaPaths, envVars } = result
    expect(condaPaths.length).toBe(7)
    expect(envVars['CONDA_PREFIX']).toEqual('C:\\Miniconda')
    expect(envVars['CONDA_SHLVL']).toEqual('1')
    expect(envVars['CONDA_DEFAULT_ENV']).toEqual('base')
    expect(envVars['CONDA_PROMPT_MODIFIER']).toEqual('(base)')
    expect(envVars['CONDA_EXE']).toEqual('C:\\Miniconda\\Scripts\\conda.exe')
    expect(envVars['_CE_M']).toEqual('')
    expect(envVars['_CE_CONDA']).toEqual('')
    expect(envVars['CONDA_PYTHON_EXE']).toEqual('C:\\Miniconda\\python.exe')
  })
})
