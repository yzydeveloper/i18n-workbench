import { Global } from '../core'

export enum InserterSupportedExtension {
    TS = 'ts',
    JS = 'js',
    JSON = 'json'
}

export type InserterId = `${InserterSupportedExtension}`

export default abstract class InserterAbstract {
    public get files() {
        return Global.loader?.files
    }

    abstract readonly id: InserterId

    abstract insert(filepath: string, value: object): Promise<object>
}
