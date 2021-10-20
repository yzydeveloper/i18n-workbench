import type { ParsedFile } from '..'
import { resolve, extname } from 'path'
import fg from 'fast-glob'
import { Loader } from './Loader'
import { Log } from '~/utils/Log'
import { Global } from '..'
import Config from '../Config'
export class LocaleLoader extends Loader {
    private _files: Record<string, ParsedFile> = {}
    private _path_matcher!: RegExp
    constructor(public readonly rootPath: string) {
        super(`[LOCALE]${rootPath}`)
    }

    get localesPath() {
        return Config.localesPath
    }

    get localesDir() {
        return resolve(this.rootPath, this.localesPath)
    }

    async init() {
        await this.setPathMather()
        await this.loadDirectory(this.localesDir)

        Log.divider()
    }

    private async setPathMather() {
        const dirnames = await fg('*', {
            onlyDirectories: true,
            cwd: this.localesDir,
        })
        let regex = ''
        if (dirnames.length)
            // dir
            regex = '^(?<locale>[\\w-_]+)(?:.*/|^).*\\.(js|ts|json)$'

        else
            // file
            regex = '^(?<locale>[\\w-_]+)\.(js|ts|json)$'

        this._path_matcher = new RegExp(regex)
    }

    get files() {
        return Object.keys(this._files)
    }

    private async loadDirectory(searchingPath: string) {
        const files = await fg('**/*.*', {
            cwd: searchingPath,
            onlyFiles: true,
            ignore: [
                ...Config.ignoreFiles
            ]
        })

        for (const relative of files)
            await this.loadFile(searchingPath, relative)
    }

    private getFileInfo(dirPath: string, relativePath: string) {
        const fullpath = resolve(dirPath, relativePath)
        const ext = extname(relativePath)

        const matcher = this._path_matcher
        const match = matcher.exec(relativePath)
        if (!match || match.length < 1)
            return
        const locale = match.groups?.locale
        if (!locale)
            return
        const parser = Global.getMatchedParser(ext)
        return {
            locale,
            filePath: fullpath,
            parser,
        }
    }

    private async loadFile(dirPath: string, relativePath: string) {
        console.log(this._files)

        try {
            const result = this.getFileInfo(dirPath, relativePath)
            if (!result) return
            const { locale, filePath, parser } = result
            if (!locale || !parser) return
            const value = await parser.load(filePath)
            this._files[filePath] = {
                filePath,
                dirPath,
                locale,
                value,
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}
