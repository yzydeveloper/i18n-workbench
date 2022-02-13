import type { WebviewPanel } from 'vscode'
import type { PayloadType, PayloadParsedType, Dictionary } from './types'
import type { InserterSupportType } from './../inserter/base'
import { join, extname } from 'path'
import { window, ViewColumn, Uri, Disposable } from 'vscode'
import Config from './Config'
import { Global, CurrentFile } from '.'
import { Inserter } from './../inserter'
import { unflatten } from 'flat'
import { findLanguage, getHtmlForWebview } from './../utils'

export interface Message {
    type: string | number
    data?: any
}
enum EventTypes {
    READY,
    CONFIG,
    TRANSLATE_SINGLE,
    SAVE
}
export class Workbench {
    public static workbench: Workbench | undefined
    private readonly panel: WebviewPanel
    private disposables: Disposable[] = []

    private get config() {
        const { loader } = Global
        const { allLocales, languageMapFile, dirStructure } = loader
        const { payload } = CurrentFile
        return {
            dirStructure,
            allLocales,
            languageMapFile,
            sourceLanguage: findLanguage(Config.sourceLanguage),
            payload
        }
    }

    private handleMessages(message: Message) {
        const { type, data } = message
        switch (type) {
            case EventTypes.READY:
                this.panel.webview.postMessage({
                    type: EventTypes.CONFIG,
                    data: this.config
                })

                break
            case EventTypes.SAVE:
                this.saveToFile(data)
                break
            case EventTypes.TRANSLATE_SINGLE:
                this.translateSignal(data)
                break
        }
    }

    private constructor() {
        this.panel = window.createWebviewPanel('workbench', '工作台', ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
        })
        this.panel.iconPath = Uri.file(
            join(Config.extensionPath, 'resources/workbench.svg')
        )
        this.panel.webview.html = getHtmlForWebview(Config.extensionPath, 'resources/workbench/index.html')
        this.panel.webview.onDidReceiveMessage((message) => this.handleMessages(message), null, this.disposables)
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables)
    }

    static createWorkbench() {
        if (!Workbench.workbench)
            Workbench.workbench = new Workbench()
        return Workbench.workbench
    }

    // 保存到文件
    public async saveToFile(data: Message['data']) {
        const parsePayload: PayloadType[] = JSON.parse(data)
        const payload = this.handlePayload(parsePayload)
        const files = Object.keys(payload)
        for (let index = 0; index < files.length; index++) {
            const file = files[index]
            const { flattenData } = payload[file]
            Inserter.insert(extname(file) as InserterSupportType, file, flattenData)
        }
    }

    // 更新单条
    public async translateSignal(data: Message['data']) {
        const { text, index } = data
        const r = await CurrentFile.translateSingle(text)
        this.panel.webview.postMessage({
            type: EventTypes.TRANSLATE_SINGLE,
            data: {
                index,
                value: r
            }
        })
    }

    // 处理等待数据
    public handlePayload(data: PayloadType[]) {
        const payloadParsed = data.reduce<Dictionary<PayloadParsedType>>((result, item) => {
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
        return payloadParsed
    }

    public dispose() {
        Workbench.workbench = undefined
        Disposable.from(...this.disposables).dispose()
        this.panel.dispose()
    }
}
