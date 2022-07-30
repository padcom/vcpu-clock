import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import externals from 'rollup-plugin-peer-deps-external'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: path.resolve(__dirname, './src/index.js'),
      formats: [ 'es' ],
      name: 'library1',
      fileName: format => `index.js`,
    },
    rollupOptions: {
      input: [
        'src/index.js'
      ],
      plugins: [
        externals()
      ]
    },
  },
  plugins: [
    externals(),
    vue(),
  ],
})
