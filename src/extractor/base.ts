
import type { Uri, Range, TextDocument } from 'vscode'
import { window } from 'vscode'
import { QUOTES_CHARACTER, TEMPLATE_CHARACTER, NON_ASCII_CHARACTERS, LETTER } from './../meta'

export type ExtractorId = 'vue'
export type ExtractorType = 'html-attribute' | 'html-inline' | 'js-string' | 'js-template' | 'jsx-text'
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
    isDynamic?: boolean
    fullText?: string
    fullStart?: number
    fullEnd?: number
    type: ExtractorType
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

    splitTemplateLiteral(content: string): string[] {
        // 1.匹配被引号包裹的
        const $1 = content.match(QUOTES_CHARACTER) || []
        // 1.将引号包裹的清除 2.将${}包裹的清除 3.分割换行 4.去空格 5.过滤
        const $2 = content
            .replace(/`/g, '')
            .replace(QUOTES_CHARACTER, '')
            .replace(TEMPLATE_CHARACTER, '')
            .split(/\n/g).map(i => i.trim()).filter(Boolean)

        // 过滤合并后不符条件得数据
        const merge = [...$1, ...$2].filter(i => i.match(LETTER)?.some(word => word.match(NON_ASCII_CHARACTERS)))
        return merge
    }

    splitTextLiteral(content: string): string[] {
        return content.split(/\n/g).map(i => i.trim()).filter(Boolean)
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult[]>
}
