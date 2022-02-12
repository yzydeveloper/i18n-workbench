import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const root = resolve(__dirname)
const outDir = resolve(__dirname, './../../resources/workbench')

export default defineConfig({
    root,
    base: '/',
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
            }
        }
    },
    plugins: [
        vue()
    ]
})
