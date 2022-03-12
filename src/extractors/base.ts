
import type { Uri, Range, TextDocument } from 'vscode'
import { window } from 'vscode'
import { QUOTES_CHARACTER, TEMPLATE_INNER_SYMBOL, CLOSED_TAG } from '../meta'
import { shouldExtract } from './rules'

export type ExtractorId = 'vue' | 'tsx' | 'jsx'

export type ExtractorType = 'html-attribute' | 'html-attribute-template' | 'html-inline' | 'html-inline-template' | 'js-string' | 'js-template' | 'jsx-text'
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
    isSetup?: boolean // script setup
    fullText?: string
    fullStart?: number
    fullEnd?: number
    fullRange?: Range
    attrName?: string // when the type is html-attribute
    type: ExtractorType
}

export interface ExtractorRuleOptions {
    importanceAttributes: string[]
    ignoreAttributes: string[]
    importanceBind: string[]
    ignoreBind: string[]
}

export default abstract class ExtractorAbstract {
    constructor(
        public readonly uri: Uri
    ) { }

    abstract readonly id: string
    abstract readonly extractorRuleOptions: ExtractorRuleOptions

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

    public shouldExtract = shouldExtract

    public getShouldExtractedText(content: string): string[] {
        const quotesInner = content.match(QUOTES_CHARACTER) || [] // 引号内的
        const forcedToMatch = content
            .replace(/`/g, '\n') // 将 ` 替换为 \n
            .replace(CLOSED_TAG, '\n') // 将 <> </> 替换为 \n
            .replace(QUOTES_CHARACTER, '') // 将 "" '' 清除
            .replace(TEMPLATE_INNER_SYMBOL, '\n') // 将 ${} 替换为 \n
            .split(/\n/g).map(i => i.trim()).filter(Boolean) // 根据 \n 分割 去空 过滤

        const merge = [...quotesInner, ...forcedToMatch].reduce<string[]>((result, text) => {
            if (shouldExtract(text))
                result.push(text)

            return result
        }, [])

        return merge
    }

    public getPlainText(content: string): string[] {
        return content.split(/\n/g).map(i => i.trim()).filter(Boolean)
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult[]>
}
