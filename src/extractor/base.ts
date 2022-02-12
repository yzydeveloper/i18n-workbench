
import type { Uri, Range, TextDocument } from 'vscode'
import { window } from 'vscode'

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

    public _document: TextDocument | undefined = window.activeTextEditor?.document
    get document() {
        return this._document
    }

    set document(value) {
        this._document = value
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult[]>
}
