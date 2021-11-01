
import type { Uri } from 'vscode'
import type { Position } from '@vue/compiler-core'
export interface ExtractorOptions {
    id: string
    uri?: Uri
}

export interface ExtractorInfo {
    content: string[]
    start: Position
    end: Position
}

export interface ExtractorResult {
    id: string
    template?: ExtractorInfo
    script?: ExtractorInfo
}

export default abstract class ExtractorAbstract {
    constructor(
        public readonly uri: Uri
    ) {}

    get filepath() {
        return this.uri.fsPath
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult>
}
