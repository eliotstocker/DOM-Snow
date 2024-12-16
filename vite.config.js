import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'snow',
      type: 'umd',
      entry: resolve(__dirname, 'js/index.js'),
      fileName: 'index.min'
    }
  }
});