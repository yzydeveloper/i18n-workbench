import type { ExtensionContext, Uri } from 'vscode'
import type { ExtractorResult } from '~/extractor/base'
import type { PendingData } from '.'
import { workspace, window } from 'vscode'
import { extname } from 'path'
import { Global } from '.'
import Config from './Config'
import { findLanguage } from '~/utils'
import { Extractor } from '~/extractor'
import { Translator } from './Translator'
export class CurrentFile {
    static uri: Uri | undefined
    static _extractor: Extractor | null = null
    static _source: ExtractorResult
    static watch(ctx: ExtensionContext) {
        ctx.subscriptions.push(workspace.onDidSaveTextDocument(e => this.uri && e?.uri === this.uri && this.update(e.uri)))
        ctx.subscriptions.push(workspace.onDidChangeTextDocument(e => {
            console.log(e, 'onDidChangeTextDocument')
        }))
        ctx.subscriptions.push(window.onDidChangeActiveTextEditor(e => e?.document && this.update(e.document.uri)))
        this.update(window.activeTextEditor?.document.uri)
    }

    static update(uri?: Uri) {
        this.uri = uri
        if (uri)
            this._extractor = new Extractor(uri)
    }

    static get id() {
        if (this.uri)
            return extname(this.uri.fsPath)
        return ''
    }

    static get source() {
        return this._source
    }

    static get pending() {
        const { script, template } = this.source
        const { allLocales } = Global.loader
        const from = findLanguage(Config.sourceLanguage)

        const words = Array.from(new Set([
            ...script?.content || [],
            ...template?.content || []
        ]))

        return words.reduce((result, word) => {
            const value = allLocales.reduce((_, locale) => {
                _[locale] = locale === from ? word : ''
                return _
            }, {} as {
                [key: string]: string
            })

            result.push({
                key: '',
                insertPath: '',
                value
            })

            return result
        }, [] as PendingData[])
    }

    /**
     * @param currentEditor
     */
    static async retrieveSourceLanguage() {
        if (this._extractor) {
            const result = await this._extractor.extract({
                id: this.id
            })
            this._source = result
        }
    }

    static write() {

    }

    // 本来批量翻译的---然后被识别成机器人~
    static async translate(text: string) {
        const pending = Array.from(new Set([text]))
        const allLocales = Global.loader.allLocales
        const from = findLanguage(Config.sourceLanguage)
        const tasks = pending.map(text => {
            return Translator.translate(from, text, allLocales).then(finish => {
                return {
                    id: Date.now(),
                    value: finish
                }
            })
        })
        const result = await Promise.all(tasks)

        return result
    }

    static async translateSingle(text: string) {
        const allLocales = Global.loader.allLocales
        const from = findLanguage(Config.sourceLanguage)
        const result = await Translator.translate(from, text, allLocales)
        return Promise.resolve(result)
    }
}
