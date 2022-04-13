import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const path = require('path')
const projectRootDir = path.resolve(__dirname)

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    envDir: path.resolve(projectRootDir, 'env'),
    // base: '/sjut/',
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(projectRootDir, 'src'),
        },
      ],
    },
    build: {
      // outDir: '/ops/park/vision/sjut',
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  })
}
