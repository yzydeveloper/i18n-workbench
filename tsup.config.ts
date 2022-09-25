import { defineConfig } from 'tsup'

export default defineConfig(() => ({
    entry: ['src/extension.ts'],
    splitting: true,
    clean: true,
    external: ['vscode'],
    noExternal: [
        /@babel\/(core|generator|parser|traverse|types|template)/,
        '@vue/compiler-core',
        'axios',
        'fast-glob',
        'flat'
    ],
}))
