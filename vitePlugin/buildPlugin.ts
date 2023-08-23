import { type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'

export function buildPlugin(): Plugin {
  return {
    name: 'build-plugin',
    closeBundle: () => {
      const buildObj = new BuildObj()
      buildObj.buildMain()
      buildObj.preparePackageJson()
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
    let pkgJsonPath = path.join(process.cwd(), 'package.json')
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    let electronConfig = localPkgJson.devDependencies.electron.replace('^', '')
    localPkgJson.main = 'mainEntry.js'
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.devDependencies = { electron: electronConfig }
    let tarJsonPath = path.join(process.cwd(), 'dist', 'package.json')
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson))
    fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'))
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
        asar: true,
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
}
