import type { WebviewPanel } from 'vscode'
import type { PayloadType, UsableData, Dictionary } from './types'
import { join } from 'path'
import { window, ViewColumn, Uri, Disposable } from 'vscode'
import { findLanguage, getHtmlForWebview } from './../utils'
import { unflatten } from 'flat'
import { Global, CurrentFile } from '.'
import Config from './Config'

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
        const payload: PayloadType[] = JSON.parse(data)
        const usableData = this.handlePayload(payload)
        console.log(usableData, 'usableData')
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
        const usableData = data.reduce<Dictionary<UsableData>>((result, item) => {
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
        return usableData
    }

    public dispose() {
        Workbench.workbench = undefined
        Disposable.from(...this.disposables).dispose()
        this.panel.dispose()
    }
}
