export function getReplacer() {
  const externalModels = [
    'os',
    'fs',
    'path',
    'events',
    'child_process',
    'crypto',
    'http',
    'buffer',
    'url',
    'better-sqlite3',
    'knex',
    // 'fs-extra',
  ]
  let result = {}
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    })
  }
  result['fs-extra'] = () => ({
    find: new RegExp(`^fs-extra$`),
    code: `const fse = require('fs-extra');export { fse as default }`,
  })
  result['electron'] = () => {
    let electronModules = [
      'clipboard',
      'ipcRenderer',
      'nativeImage',
      'shell',
      'webFrame',
    ].join(',')
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    }
  }
  return result
}
