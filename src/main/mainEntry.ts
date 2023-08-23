import { join } from 'path'
import {
  app,
  BrowserWindow,
  type BrowserWindowConstructorOptions,
} from 'electron'
import { CustomScheme } from './CustomScheme'
import { CommonWindowEvent } from './CommonWindowEvent'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
export let mainWindow: BrowserWindow
app.whenReady().then(() => {
  const config: BrowserWindowConstructorOptions = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
    show: false,
    frame: false,
    icon: join(__dirname, './map-icon.ico'),
  }
  mainWindow = new BrowserWindow(config)
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })
  process.env.NODE_ENV === 'development' && // 仅在开发环境下默认打开devTools, 按Ctrl Shift I也可以打开
    mainWindow.webContents.openDevTools({ mode: 'undocked' })
  if (process.argv[2]) {
    mainWindow.loadURL(process.argv[2])
  } else {
    CustomScheme.registerScheme()
    mainWindow.loadURL('app://index.html')
  }
  CommonWindowEvent.listen()
})

app.on('browser-window-created', (_e, win) => {
  CommonWindowEvent.regWinEvent(win)
})
