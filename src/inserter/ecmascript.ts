import Inserter from './base'
export class EcmascriptInserter extends Inserter {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) {
        super()
    }

    insert(filepath: string, value: object) { }
}
