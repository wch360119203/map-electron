import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer, buildPlugin } from './vitePlugin'
import optimizer from 'vite-plugin-optimizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  build: {
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  },
})
