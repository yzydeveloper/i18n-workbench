import { resolve } from 'path'
import { builtinModules } from 'module'

import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/extension.ts'),
            formats: ['cjs'],
        },
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
            },
            external: [...builtinModules, 'vscode']
        },
        commonjsOptions: {},
        sourcemap: false,
        minify: false,
        watch: {}
    },
    optimizeDeps: {
        exclude: ['vscode']
    }
})
