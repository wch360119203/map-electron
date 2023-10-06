import { BrowserWindow, ipcMain, app, type IpcMainInvokeEvent } from 'electron'
export class CommonWindowEvent {
  static listen() {
    ipcMain.handle('minimizeWindow', (e) => {
      getWin(e)?.minimize()
    })
    ipcMain.handle('maxmizeWindow', (e) => {
      getWin(e)?.maximize()
    })

    ipcMain.handle('unmaximizeWindow', (e) => {
      getWin(e)?.unmaximize()
    })

    ipcMain.handle('hideWindow', (e) => {
      getWin(e)?.hide()
    })
    ipcMain.handle('showWindow', (e) => {
      getWin(e)?.show()
    })

    ipcMain.handle('closeWindow', (e) => {
      getWin(e)?.close()
    })
    ipcMain.handle('resizable', (e) => {
      return getWin(e)?.isResizable()
    })
    ipcMain.handle('getPath', (_e, name: any) => {
      return app.getPath(name)
    })
    ipcMain.handle('reload', (e) => {
      return e.sender.reload()
    })
    ipcMain.handle('toggleDevTools', (e) => {
      return e.sender.toggleDevTools()
    })
    ipcMain.handle('fullScreen', (e) => {
      const win = getWin(e)
      if (!win) return
      return win.setFullScreen(!win.fullScreen)
    })
  }
  static regWinEvent(win: BrowserWindow) {
    win.on('maximize', () => {
      win.webContents.send('windowMaximized')
    })
    win.on('unmaximize', () => {
      win.webContents.send('windowUnmaximized')
    })
  }
}
function getWin(e: IpcMainInvokeEvent) {
  return BrowserWindow.fromWebContents(e.sender)
}
