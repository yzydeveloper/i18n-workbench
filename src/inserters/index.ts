import InserterAbstract, { InserterId } from './base'
import { EcmascriptInserter } from './ecmascript'
import { JsonInserter } from './json'

export class Inserter {
    private static inserters: Record<InserterId, InserterAbstract> = {
        js: new EcmascriptInserter(),
        ts: new EcmascriptInserter(),
        json: new JsonInserter()
    }

    static insert(extname: InserterId, filepath: string, value: object) {
        return this.inserters[extname].insert(filepath, value)
    }
}
