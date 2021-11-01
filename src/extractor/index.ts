import { Uri } from 'vscode'
import { extname } from 'path'
import ExtractorAbstract, { ExtractorOptions } from './base'
import { SfcExtractor } from './Sfc'
export class Extractor {
    extractors: Record<string, ExtractorAbstract> = {
        '.vue': new SfcExtractor(this.uri)
    }

    constructor(
        private readonly uri: Uri
    ) { }

    get id() {
        return extname(this.uri.fsPath)
    }

    extract(options: ExtractorOptions) {
        const extractor = this.extractors[options.id]
        return extractor.extractor(options)
    }
}
