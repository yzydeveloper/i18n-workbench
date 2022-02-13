import InserterAbstract, { InserterSupportType } from './base'
import { EcmascriptInserter } from './ecmascript'
export class Inserter {
    private static inserters: Record<InserterSupportType, InserterAbstract> = {
        '.js': new EcmascriptInserter(),
        '.ts': new EcmascriptInserter()
    }

    static insert(extname: InserterSupportType, filepath: string, value: object) {
        return this.inserters[extname].insert(filepath, value)
    }
}
