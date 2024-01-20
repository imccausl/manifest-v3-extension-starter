import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import entryPlugin from './infrastructure/plugins/entryplugin'

export default defineConfig({
  plugins: [react(), entryPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
})
