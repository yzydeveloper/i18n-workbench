import { Uri } from 'vscode'
import { extname } from 'path'
import ExtractorAbstract, { ExtractorSupportedExtensions, ExtractorOptions } from './base'
import { SfcExtractor } from './sfc'
import { BabelExtractor } from './babel'

export class Extractor {
    extractors: Record<string, ExtractorAbstract> = {
        [`.${ExtractorSupportedExtensions.VUE}`]: new SfcExtractor(this.uri),
        [`.${ExtractorSupportedExtensions.TSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtensions.JSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtensions.TS}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtensions.JS}`]: new BabelExtractor(this.uri)
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
