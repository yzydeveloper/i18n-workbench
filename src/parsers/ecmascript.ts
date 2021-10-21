import { workspace } from 'vscode'
export class EcmascriptParser {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) { }

    async load(filepath: string) {
        const regex = /export default/
        const document = await workspace.openTextDocument(filepath)
        const texts = await document.getText()
        if (!texts) return {}
        // eslint-disable-next-line no-eval
        return (0, eval)(`(${texts.replace(regex, '')})`)
    }
}
