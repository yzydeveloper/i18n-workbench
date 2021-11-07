import type { WebviewPanel } from 'vscode'
import { join } from 'path'
import { readFileSync } from 'fs'
import Config from './Config'
import { window, ViewColumn, Uri, Disposable, workspace } from 'vscode'
import {
    parse
    , parseExpression
} from '@babel/parser'
import traverse from '@babel/traverse'
import { Global } from '.'
export interface Message {
    type: string
    data?: any
}
export class Workbench {
    public static workbench: Workbench | undefined
    private readonly panel: WebviewPanel
    private disposables: Disposable[] = []

    private handleMessages(message: Message) {
        const { type } = message
        switch (type) {
            case 'create':
                this.create()
                break
        }
    }

    private constructor() {
        this.panel = window.createWebviewPanel(
            'workbench',
            '工作台',
            ViewColumn.Beside,
            { enableScripts: true }
        )

        this.panel.iconPath = Uri.file(
            join(Config.extensionPath, 'resources/workbench.svg')
        )

        this.panel.webview.html = readFileSync(
            join(Config.extensionPath, 'resources/workbench.html'),
            'utf-8',
        )

        this.panel.webview.onDidReceiveMessage((message) => this.handleMessages(message), null, this.disposables)

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables)
    }

    static createWorkbench() {
        if (!Workbench.workbench)
            Workbench.workbench = new Workbench()
        return Workbench.workbench
    }

    // TODO test
    public async create() {
        const mock = `{
            warningStates: {
                IN_WARNING: '告警中',
                SHIELDED: '已屏蔽',
                LIFTED: '已解除',
            },
        }`
        const { files } = Global.loader
        console.log(files, 'loader')
        const filePath = files[2]
        const document = await workspace.openTextDocument(filePath)
        const texts = await document.getText()
        const sourceAst = parse(texts, {
            sourceType: 'module'
        })
        traverse(sourceAst, {
            ObjectProperty(path: any) {
                console.log(path, 'path>>>sourceAst<<<')
            }
        })
        console.log(parseExpression(mock), '>>>ast<<<')
    }

    public supplyWords() {
        this.panel.webview.postMessage({
            type: 'words'
        })
    }

    public dispose() {
        Workbench.workbench = undefined

        Disposable.from(...this.disposables).dispose()

        this.panel.dispose()
    }
}
