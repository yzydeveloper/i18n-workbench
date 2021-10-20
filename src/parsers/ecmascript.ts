export class EcmascriptParser {
    constructor(public readonly id: 'js'|'ts' = 'js') {}

    async load(filepath: string) {
        console.log(filepath)
    }
}
