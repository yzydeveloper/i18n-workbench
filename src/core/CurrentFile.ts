import type { ExtensionContext, Uri } from 'vscode'
import type { ExtractorResult } from './../extractor/base'
import type { Dictionary, PendingWrite, PendingWriteParsed } from '.'
import type { InserterSupportType } from './../inserter/base'
import { workspace, window } from 'vscode'
import { extname } from 'path'
import { unflatten } from 'flat'
import { Global } from '.'
import Config from './Config'
import { findLanguage } from './../utils'
import { Extractor } from './../extractor'
import { Translator } from './Translator'
import { Inserter } from './../inserter'
export class CurrentFile {
    static uri: Uri | undefined
    static _extractor: Extractor | null = null
    static _extractor_result: ExtractorResult[]
    static watch(ctx: ExtensionContext) {
        ctx.subscriptions.push(workspace.onDidSaveTextDocument(e => this.uri && e?.uri === this.uri && this.update(e.uri)))
        ctx.subscriptions.push(workspace.onDidChangeTextDocument((e) => {
            if (e) {
                this.update(e.document.uri)
                this.extract()
            }
        }))
        ctx.subscriptions.push(window.onDidChangeActiveTextEditor(e => {
            if (e) {
                this.update(e.document.uri)
                this.extract()
            }
        }))
        if (window.activeTextEditor) {
            this.update(window.activeTextEditor.document.uri)
            this.extract()
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

    static get extractorResult() {
        return this._extractor_result
    }

    static set extractorResult(value) {
        this._extractor_result = value
    }

    static get pendingWrite() {
        const { allLocales } = Global.loader
        const from = findLanguage(Config.sourceLanguage)

        return this.extractorResult.reduce<PendingWrite[]>((result, item) => {
            const languages = allLocales.reduce<PendingWrite['languages']>((_, locale) => {
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
    static async extract() {
        if (this._extractor) {
            const result = await this._extractor.extract({
                id: this.id,
                uri: this.uri
            })
            this.extractorResult = result
        }
    }

    static write(data: any) {
        const temp: PendingWrite[] = JSON.parse(data)
        const pendingWrite = this.handlePendingWrite(temp)
        const files = Object.keys(pendingWrite)
        for (let index = 0; index < files.length; index++) {
            const file = files[index]
            const { flattenData } = pendingWrite[file]
            Inserter.insert(extname(file) as InserterSupportType, file, flattenData)
        }
    }

    static handlePendingWrite(data: PendingWrite[]) {
        const pendingWriteParsed = data.reduce<Dictionary<PendingWriteParsed>>((result, item) => {
            const { key, insertPath, languages } = item
            const rootKey = key.split('.')[0]
            if (key && rootKey) {
                Object.keys(item.insertPath).forEach(locale => {
                    if (typeof insertPath === 'object') {
                        if (!result[insertPath[locale]]) {
                            result[insertPath[locale]] = {
                                rootKeys: [],
                                unFlattenData: {},
                                flattenData: {}
                            }
                        }
                        result[insertPath[locale]].rootKeys.push(rootKey)
                        result[insertPath[locale]].flattenData[key] = languages[locale]
                        result[insertPath[locale]].unFlattenData = unflatten(result[insertPath[locale]].flattenData)
                    }
                })
            }
            return result
        }, {})
        return pendingWriteParsed
    }

    static async translateSingle(text: string) {
        const allLocales = Global.loader.allLocales
        const from = findLanguage(Config.sourceLanguage)
        const result = await Translator.translate(from, text, allLocales)
        return Promise.resolve(result)
    }
}
