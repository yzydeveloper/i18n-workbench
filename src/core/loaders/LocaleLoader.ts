import { resolve } from 'path'
import fg from 'fast-glob'
import { Loader } from './Loader'
import { Log } from '~/utils/Log'
import Config from '../Config'
export class LocaleLoader extends Loader {
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
        Log.divider()
    }

    private async loadDirectory(searchingPath: string) {
        const files = await fg('**/*.*', {
            cwd: searchingPath,
            onlyFiles: true,
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
