import { ViteDevServer, type Plugin } from 'vite'
import { spawn } from 'child_process'
export function devPlugin(): Plugin {
  return {
    name: 'dev-plugin',
    configureServer(server: ViteDevServer) {
      require('esbuild').buildSync({
        entryPoints: ['src/main/mainEntry.ts'],
        bundle: true,
        platform: 'node',
        outfile: 'dist/mainEntry.js',
        external: ['electron'],
      })
      if (!server.httpServer) throw new Error()
      let electronProcess: ReturnType<typeof spawn>
      server.httpServer.once('listening', () => {
        if (!server.httpServer) throw new Error()
        const addressInfo = server.httpServer.address()
        let httpAddress: string
        if (typeof addressInfo === 'string') httpAddress = addressInfo
        else if (!addressInfo) httpAddress = 'http://127.0.0.1:5173/'
        else {
          const address = /^::/g.test(addressInfo.address)
            ? 'localhost'
            : addressInfo.address
          httpAddress = `http://${address}:${addressInfo.port}`
          console.log('electron监听地址:', '\x1B[36m', httpAddress, '\x1B[36m')
        }
        electronProcess = spawn(
          require('electron').toString(),
          ['dist/mainEntry.js', httpAddress],
          {
            cwd: process.cwd(),
            stdio: 'inherit',
          },
        )
        electronProcess.on('close', () => {
          server.close()
          process.exit()
        })
      })
      // 关闭vite，也干掉electron
      server.httpServer.once('close', () => {
        electronProcess?.kill()
      })
    },
  }
}
