import type { Uri, Range, TextDocument } from 'vscode'
import { window } from 'vscode'

export enum ExtractSupportedExtensions {
    VUE = 'vue',
    TSX = 'tsx',
    JSX = 'jsx',
    TS = 'ts',
    JS = 'js'
}

export type ExtractorId = `${ExtractSupportedExtensions}`

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
    isJsx?: boolean
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

    public _document: TextDocument | undefined = window.activeTextEditor?.document

    get document() {
        return this._document
    }

    set document(value) {
        this._document = value
    }

    abstract extractor(options: ExtractorOptions): Promise<ExtractorResult[]>
}
