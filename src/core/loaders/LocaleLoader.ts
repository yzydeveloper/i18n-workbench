import { resolve } from 'path'
import fg from 'fast-glob'
import { Loader } from './Loader'
import { Log } from '~/utils/Log'
import { Global } from '..'
import Config from '../Config'
export class LocaleLoader extends Loader {
    private matcher: { matcher: string; regex: RegExp } = {
        matcher: '{locale}.{ext}',
        regex: /^(?<locale>[\w-_]+)\.(?<ext>)$/
    }

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
        await this.loadDirectory(this.localesDir)
        this.matcher = Global.getPathMatcher()

        Log.divider()
    }

    private async loadDirectory(searchingPath: string) {
        const files = await fg('**/*.*', {
            cwd: searchingPath,
            onlyFiles: true,
            // ignore:[]
        })
        console.log(files)

        for (const relative of files)
            await this.loadFile(searchingPath, relative)
    }

    private async loadFile(dirpath: string, relativePath: string) {
        console.log(dirpath, 'dirpath')
        console.log(relativePath, 'relativePath')
    }
}
