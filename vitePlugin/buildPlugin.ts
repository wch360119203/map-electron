import { type Plugin } from 'vite'
import path from 'path'
import fs from 'fs-extra'

export function buildPlugin(): Plugin {
  return {
    name: 'build-plugin',
    closeBundle: async () => {
      const buildObj = new BuildObj()
      buildObj.buildMain()
      buildObj.preparePackageJson()
      await buildObj.prepareBettereSqlite3()
      buildObj.buildInstaller()
    },
  }
}
class BuildObj {
  //编译主进程代码
  buildMain() {
    require('esbuild').buildSync({
      entryPoints: ['src/main/mainEntry.ts'],
      bundle: true,
      platform: 'node',
      minify: true,
      outfile: 'dist/mainEntry.js',
      external: ['electron'],
    })
  }
  //为生产环境准备package.json
  preparePackageJson() {
    const pkgJsonPath = path.join(process.cwd(), 'package.json')
    const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    const electronConfig = localPkgJson.devDependencies.electron.replace(
      '^',
      '',
    )
    localPkgJson.main = 'mainEntry.js'
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies //干掉所有的开发依赖
    localPkgJson.devDependencies = { electron: electronConfig }
    if (!localPkgJson.dependencies) localPkgJson.dependencies = {}
    localPkgJson.dependencies['better-sqlite3'] = '*'
    // localPkgJson.dependencies['bindings'] = '*'
    const tarJsonPath = path.join(process.cwd(), 'dist', 'package.json')
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson))
    fs.ensureDirSync(path.join(process.cwd(), 'dist/node_modules'))
  }
  //使用electron-builder制成安装包
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), 'release'),
          app: path.join(process.cwd(), 'dist'),
        },
        files: ['**'],
        extends: null,
        productName: '基础地图',
        win: { icon: path.join(process.cwd(), 'dist/map-icon.ico') },
        appId: 'com.map-electron.desktop',
        asar: false,
        nsis: {
          oneClick: false, // 是否一键安装
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          // installerIcon: path.join(process.cwd(), 'public/map-icon.ico'), // 安装图标
          // uninstallerIcon: path.join(process.cwd(), 'public/map-icon.ico'), // 卸载图标
          // installerHeaderIcon: path.join(process.cwd(), 'public/map-icon.ico'), // 安装时头部图标
          perMachine: true,
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: false, // 创建开始菜单图标
          shortcutName: '基础地图', // 图标名称
        },
        publish: [{ provider: 'generic', url: 'http://localhost:5566/' }],
      },
      project: process.cwd(),
    }
    return require('electron-builder').build(options)
  }

  /** 编译better-sqlite3 */
  async prepareBettereSqlite3() {
    const srcdir = path.join(process.cwd(), 'node_modules/better-sqlite3')
    const distdir = path.join(process.cwd(), 'dist/node_modules/better-sqlite3')
    fs.ensureDirSync(distdir)
    await fs.readdir(srcdir).then(async (list) => {
      const todo = []
      list.forEach((fileName) => {
        const p = fs.copy(
          path.join(srcdir, fileName),
          path.join(distdir, fileName),
          {
            filter: (src) => {
              if (
                src.endsWith('better-sqlite3') ||
                src.endsWith('build') ||
                src.endsWith('Release') ||
                src.endsWith('better_sqlite3.node')
              )
                return true
              else if (src.includes('node_modules\\better-sqlite3\\lib'))
                return true
              else return false
            },
          },
        )
        todo.push(p)
      })
      await Promise.all(todo)
    })
    const pkgJson = '{"name": "better-sqlite3","main": "lib/index.js"}'
    const pkgJsonPath = path.join(
      process.cwd(),
      `dist/node_modules/better-sqlite3/package.json`,
    )
    fs.writeFileSync(pkgJsonPath, pkgJson)

    // const bindingPath = path.join(
    //   process.cwd(),
    //   'dist/node_modules/bindings/index.js',
    // )
    // fs.ensureFileSync(bindingPath)
    // const bindingsContent = `module.exports = () => {
    //   const addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
    //   return addonPath;
    //   };`
    // fs.writeFileSync(bindingPath, bindingsContent)
    // const bindingPkgJson = `{"name": "bindings","main": "index.js"}`
    // const bindingPkgJsonPath = path.join(
    //   process.cwd(),
    //   `dist/node_modules/bindings/package.json`,
    // )
    // fs.writeFileSync(bindingPkgJsonPath, bindingPkgJson)
  }
}
