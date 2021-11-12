import type { ParsedFile, DirStructure } from '..'
import { resolve, extname } from 'path'
import fg from 'fast-glob'
import { Loader } from './Loader'
import { Log } from '~/utils/Log'
import { Global } from '..'
import Config from '../Config'
export class LocaleLoader extends Loader {
    private _files: Record<string, ParsedFile> = {}
    private _path_matcher!: RegExp
    private _locale_file_language: Record<string, any> = {}
    private _dir_structure: DirStructure = ''
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
        if (dirnames.length) {
            this._dir_structure = 'dir'
            regex = '^(?<locale>[\\w-_]+)(?:.*/|^).*\\.(js|ts|json)$'
        }
        else {
            this._dir_structure = 'file'
            regex = '^(?<locale>[\\w-_]+)\.(js|ts|json)$'
        }
        this._path_matcher = new RegExp(regex)
    }

    // 所有文件路径
    get files() {
        return Object.keys(this._files)
    }

    // 目录结构 dir | file
    get dirStructure() {
        return this._dir_structure
    }

    // 所有语言
    get allLocales() {
        return Object.keys(this._locale_file_language)
    }

    // 语言文件数据映射
    get localeFileLanguage() {
        return this._locale_file_language
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
        try {
            const result = this.getFileInfo(dirPath, relativePath)
            if (!result) return
            const { locale, filePath, parser } = result
            if (!locale || !parser) return
            const value = await parser.load(filePath)
            const data = {
                filePath,
                dirPath,
                locale,
                value,
            }
            this._files[filePath] = data
            !this._locale_file_language[locale] && (this._locale_file_language[locale] = {})
            this._locale_file_language[locale][filePath] = data
        }
        catch (e) {
            console.log(e)
        }
    }
}
