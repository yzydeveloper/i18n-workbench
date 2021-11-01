import ExtractorAbstract, { ExtractorOptions, ExtractorResult } from './base'
import { workspace } from 'vscode'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        console.log(doc, 'doc')

        console.log(options, 'options')
        return {
            id: 'vue'
        }
    }
}
