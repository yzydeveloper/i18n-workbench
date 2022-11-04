import { writeFileSync } from 'fs'
import { unflatten } from 'flat'
import Inserter, { InserterSupportedExtension } from './base'

export class JsonInserter extends Inserter {
    public readonly id = InserterSupportedExtension.JSON

    async insert(filepath: string, value: object) {
        const file = this.files[filepath]
        const { flattenValue } = file
        const mergeObject = unflatten<object, Record<string, object | string>>({
            ...flattenValue,
            ...value
        })

        writeFileSync(filepath, JSON.stringify(mergeObject, null, 4))

        return Promise.resolve({})
    }
}
