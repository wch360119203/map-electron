import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer, buildPlugin } from './vitePlugin'
import optimizer from 'vite-plugin-optimizer'
import { fileURLToPath, URL } from 'url'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      plugins: [buildPlugin()],
    },
    chunkSizeWarningLimit: 5000,
    assetsInlineLimit: 0,
  },
})
