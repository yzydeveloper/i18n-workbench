import type { ParsedFile, DirStructure } from '..'
import { resolve, extname, basename } from 'path'
import { workspace, RelativePattern } from 'vscode'
import fg from 'fast-glob'
import { flatten } from 'flat'
import { Loader } from './Loader'
import { Log, findLanguage } from './../../utils'
import { Global } from '..'
import Config from '../Config'

export class LocaleLoader extends Loader {
    private _files: Record<string, ParsedFile> = {}

    private _path_matcher!: RegExp

    private _dir_structure: DirStructure = ''

    constructor(
        public readonly rootPath: string
    ) {
        super(`[LOCALE]${rootPath}`)
    }

    get localesPath() {
        return Config.localesPath
    }

    get localesDir() {
        return resolve(this.rootPath, this.localesPath)
    }

    async init(watch = true) {
        await this.setPathMather()
        await this.loadDirectory(this.localesDir)
        if (watch) { this.watchOn(this.localesDir) }

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
        } else {
            this._dir_structure = 'file'
            regex = '^(?<locale>[\\w-_]+).(js|ts|json)$'
        }
        this._path_matcher = new RegExp(regex)
    }

    private async watchOn(rootPath: string) {
        Log.info(`\n👀 Watching change on ${rootPath}`)
        const watcher = workspace.createFileSystemWatcher(
            new RelativePattern(rootPath, '**/*'),
        )

        watcher.onDidChange(this.onFileChanged, this, this._disposables)
        watcher.onDidCreate(this.onFileChanged, this, this._disposables)
        watcher.onDidDelete(this.onFileChanged, this, this._disposables)

        this._disposables.push(watcher)
    }

    private async onFileChanged() {
        this.init(false)
    }

    get allLocales() {
        return Object.keys(this.files).reduce<string[]>((result, key) => {
            const { locale } = this.files[key]
            if (!result.includes(locale)) { result.push(locale) }
            return result
        }, [])
    }

    get dirStructure() {
        return this._dir_structure
    }

    get files() {
        return this._files
    }

    // { text: [keypath] }
    get textMappingKey() {
        const from = findLanguage(Config.sourceLanguage)
        const map = new Map<string, string[]>()
        Object.keys(this.files).forEach((key) => {
            const { locale, flattenValue, group } = this.files[key]
            if (locale === from) {
                Object.keys(flattenValue).forEach(keypath => {
                    const text: string = Reflect.get(flattenValue, keypath)
                    const keypaths = map.get(text)
                    let item = keypath
                    if (this.dirStructure === 'dir') { item = `${group}.${keypath}` }

                    if (!keypaths) { map.set(text, [item]) } else { map.set(text, keypaths.concat(item)) }
                })
            }
        })
        return map
    }

    // { lang: [path] }
    get languageMapFile() {
        return Object.keys(this.files).reduce<Record<string, string[]>>((result, key) => {
            const { locale } = this.files[key]
            if (!result[locale]) { result[locale] = [] }
            if (!result[locale].includes(key)) { result[locale].push(key) }
            return result
        }, {})
    }

    private async loadDirectory(searchingPath: string) {
        const files = await fg('**/*.*', {
            cwd: searchingPath,
            onlyFiles: true,
            ignore: [
                ...Config.ignoreFiles
            ]
        })

        Promise.all(
            files.map(relative => this.loadFile(searchingPath, relative))
        )
    }

    private getFileInfo(dirPath: string, relativePath: string) {
        const fullpath = resolve(dirPath, relativePath)
        const ext = extname(relativePath)
        const group = basename(relativePath).replace(ext, '')

        const matcher = this._path_matcher
        const match = matcher.exec(relativePath)
        if (!match || match.length < 1) { return }
        const locale = match.groups?.locale
        if (!locale) { return }
        const parser = Global.getMatchedParser(ext)
        return {
            originLocale: locale,
            locale: findLanguage(locale),
            group,
            filepath: fullpath,
            parser,
        }
    }

    private async loadFile(dirPath: string, relativePath: string) {
        try {
            const result = this.getFileInfo(dirPath, relativePath)
            if (!result) return
            const { originLocale, locale, group, filepath, parser } = result
            if (!locale || !parser) return
            const value = await parser.load(filepath)
            const flattenValue = flatten<object, object>(value)
            this._files[filepath] = {
                originLocale,
                locale,
                group,
                filepath,
                dirPath,
                unflattenValue: value,
                flattenValue
            }
        } catch (e) {
            console.log(e)
        }
    }

    public syncFiles() {
        this.init(false)
    }
}
