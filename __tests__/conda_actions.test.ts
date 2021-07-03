import * as fs from 'fs'
import * as path from 'path'
import { parseActivationScriptOutput } from '../src/conda_actions'

describe('Parse evn activation output', () => {
  it('Parse linux activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/linux_conda_bash_activation.sh')
      )
      .toString('utf8')
    const condaPaths: string[] = await parseActivationScriptOutput(
      activationStr,
      'export ',
      ':'
    )
    expect(condaPaths.length).toBe(3)
  })
  it('Parse macOs activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/mac_conda_bash_activation.sh')
      )
      .toString('utf8')
    const condaPaths: string[] = await parseActivationScriptOutput(
      activationStr,
      'export ',
      ':'
    )
    expect(condaPaths.length).toBe(3)
  })
  it('Parse windows activation', async () => {
    const activationStr = fs
      .readFileSync(
        path.resolve(__dirname, 'data/windows_conda_powershell_activation.ps1')
      )
      .toString('utf8')
    const condaPaths: string[] = await parseActivationScriptOutput(
      activationStr,
      '$Env:',
      ';'
    )
    expect(condaPaths.length).toBe(7)
  })
})
