import { Global } from './../core'

export type InserterSupportType = '.js' | '.ts'

export default abstract class InserterAbstract {
    public get files() {
        return Global.loader?.files
    }

    abstract insert(filepath: string, value: object): Promise<object>
}
