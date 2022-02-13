import type { ExtensionContext, Uri } from 'vscode'
import type { ExtractorResult } from './../extractor/base'
import type { PayloadType } from '.'
import { workspace, window } from 'vscode'
import { extname } from 'path'
import { Global } from '.'
import Config from './Config'
import { findLanguage } from './../utils'
import { Extractor } from './../extractor'
import { Translator } from './Translator'
export class CurrentFile {
    static uri: Uri | undefined
    static _extractor: Extractor | null = null
    static _extractor_result: ExtractorResult[]
    static watch(ctx: ExtensionContext) {
        ctx.subscriptions.push(workspace.onDidSaveTextDocument(e => this.uri && e?.uri === this.uri && this.update(e.uri)))
        ctx.subscriptions.push(workspace.onDidChangeTextDocument((e) => {
            if (e)
                this.retrieveSourceLanguage()
        }))
        ctx.subscriptions.push(window.onDidChangeActiveTextEditor(e => {
            if (e) {
                this.update(e.document.uri)
                this.retrieveSourceLanguage()
            }
        }))
        if (window.activeTextEditor) {
            this.update(window.activeTextEditor.document.uri)
            this.retrieveSourceLanguage()
        }
    }

    static update(uri: Uri) {
        this.uri = uri
        if (this._extractor?.id !== this.id)
            this._extractor = new Extractor(uri)
    }

    static get id() {
        if (this.uri)
            return extname(this.uri.fsPath)
        return ''
    }

    static get extractor_result() {
        return this._extractor_result
    }

    static set extractor_result(value) {
        this._extractor_result = value
    }

    static get payload() {
        const { allLocales } = Global.loader
        const from = findLanguage(Config.sourceLanguage)

        return this.extractor_result.reduce<PayloadType[]>((result, item) => {
            const languages = allLocales.reduce<PayloadType['languages']>((_, locale) => {
                _[locale] = locale === from ? item.text : ''
                return _
            }, {})

            result.push({
                key: '',
                insertPath: {},
                languages
            })
            return result
        }, [])
    }

    /**
     * @param currentEditor
     */
    static async retrieveSourceLanguage() {
        if (this._extractor) {
            const result = await this._extractor.extract({
                id: this.id
            })
            this.extractor_result = result
        }
    }

    static write() {

    }

    static async translateSingle(text: string) {
        const allLocales = Global.loader.allLocales
        const from = findLanguage(Config.sourceLanguage)
        const result = await Translator.translate(from, text, allLocales)
        return Promise.resolve(result)
    }
}
