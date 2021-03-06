import { Uri } from 'vscode'
import { extname } from 'path'
import ExtractorAbstract, { ExtractorOptions } from './base'
import { SfcExtractor } from './Sfc'
import { BabelExtractor } from './babel'

export class Extractor {
    extractors: Record<string, ExtractorAbstract> = {
        '.vue': new SfcExtractor(this.uri),
        '.tsx': new BabelExtractor(this.uri)
    }

    constructor(
        private readonly uri: Uri
    ) { }

    get id() {
        return extname(this.uri.fsPath)
    }

    extract(options: ExtractorOptions) {
        const extractor = this.extractors[options.id]
        if (!extractor) return []
        return extractor.extractor(options)
    }
}
