
import type { Uri, Range } from 'vscode'

export type ExtractorId = 'vue'
export type ExtractorSource = ''
export interface ExtractorOptions {
    id: string
    uri?: Uri
}
export interface ExtractorResult {
    id: ExtractorId
    text: string
    start: number
    end: number
    range: Range
    source?: ExtractorSource
}
export default abstract class ExtractorAbstract {
    constructor(
        public readonly uri: Uri
    ) { }

    get filepath() {
        return this.uri.fsPath
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult[]>
}
