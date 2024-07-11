import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import entryPlugin from './infrastructure/plugins/entryplugin'

export default defineConfig({
    plugins: [react(), entryPlugin()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: 'assets/[name].js',
            },
        },
    },
})
