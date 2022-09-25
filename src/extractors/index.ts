import { Uri } from 'vscode'
import { extname } from 'path'
import ExtractorAbstract, { ExtractSupportedExtensions, ExtractorOptions } from './base'
import { SfcExtractor } from './sfc'
import { BabelExtractor } from './babel'

export class Extractor {
    extractors: Record<string, ExtractorAbstract> = {
        [`.${ExtractSupportedExtensions.VUE}`]: new SfcExtractor(this.uri),
        [`.${ExtractSupportedExtensions.TSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractSupportedExtensions.JSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractSupportedExtensions.TS}`]: new BabelExtractor(this.uri),
        [`.${ExtractSupportedExtensions.JS}`]: new BabelExtractor(this.uri)
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
