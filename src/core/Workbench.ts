import type { WebviewPanel } from 'vscode'
import { join } from 'path'
import { window, ViewColumn, Uri, Disposable } from 'vscode'
import Config from './Config'
import { Global, CurrentFile } from '.'
import { findLanguage, getHtmlForWebview } from './../utils'

export interface Message {
    type: string | number
    data?: any
}

export enum EventTypes {
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
        const { pendingWrite } = CurrentFile
        return {
            dirStructure,
            allLocales,
            languageMapFile,
            sourceLanguage: findLanguage(Config.sourceLanguage),
            pendingWrite
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
                CurrentFile.write(data)
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
        if (!Workbench.workbench) { Workbench.workbench = new Workbench() }
        return Workbench.workbench
    }

    static sendMessage(message: Message) {
        Workbench.workbench?.handleMessages(message)
    }

    // 更新单条
    public async translateSignal(data: Message['data']) {
        const { text, index } = data
        const r = await CurrentFile.translate(text)
        this.panel.webview.postMessage({
            type: EventTypes.TRANSLATE_SINGLE,
            data: {
                index,
                value: r
            }
        })
    }

    public dispose() {
        Workbench.workbench = undefined
        Disposable.from(...this.disposables).dispose()
        this.panel.dispose()
    }
}
