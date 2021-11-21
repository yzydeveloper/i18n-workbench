/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
'use strict'

const path = require('path')

/** @type {import('webpack').Configuration} */
const config = {
    target: 'node',
    entry: './src/extension.ts',
    optimization: {
        minimize: false,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    //   devtool: 'source-map',
    devtool: false,
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js'],
        modules: ['node_modules'],
        alias: {
            '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
}
module.exports = config
