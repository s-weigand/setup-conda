import { loadConfig } from '../src/load_config'

test('Reading of the config', () => {
  const config = loadConfig()
  expect(config.conda_version).toEqual('latest')
  expect(config.python_version).toEqual('default')
  expect(config.os).toEqual('linux')
})
