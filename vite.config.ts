import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

import entryPlugin from './infrastructure/plugins/entryplugin'

export default defineConfig({
    plugins: [react(), entryPlugin()],
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                chunkFileNames: 'assets/[name].js',
            },
            onLog(level, log, handler) {
                if (
                    log.cause &&
                    // @ts-expect-error - `message` is not in the type definition
                    log.cause.message ===
                        `Can't resolve original location of error.`
                ) {
                    return
                }
                handler(level, log)
            },
        },
    },
})
