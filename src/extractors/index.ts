import { Uri } from 'vscode'
import { extname } from 'path'
import ExtractorAbstract, { ExtractorSupportedExtension, ExtractorOptions } from './base'
import { SfcExtractor } from './sfc'
import { BabelExtractor } from './babel'

export class Extractor {
    extractors: Record<string, ExtractorAbstract> = {
        [`.${ExtractorSupportedExtension.VUE}`]: new SfcExtractor(this.uri),
        [`.${ExtractorSupportedExtension.TSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtension.JSX}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtension.TS}`]: new BabelExtractor(this.uri),
        [`.${ExtractorSupportedExtension.JS}`]: new BabelExtractor(this.uri)
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
