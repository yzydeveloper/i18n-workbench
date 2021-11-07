import type { WebviewPanel } from 'vscode'
import { join } from 'path'
import { readFileSync } from 'fs'
import Config from './Config'
import { window, ViewColumn, Uri } from 'vscode'
export class Workbench {
    public static workbench: Workbench | undefined
    private readonly panel: WebviewPanel

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

        this.panel.onDidDispose(() => {
            this.dispose()
        })
    }

    static createWorkbench() {
        if (!Workbench.workbench)
            Workbench.workbench = new Workbench()
        return Workbench.workbench
    }

    public supplyWords() {
        this.panel.webview.postMessage({
            type: 'words'
        })
    }

    public dispose() {
        Workbench.workbench = undefined

        this.panel.dispose()
    }
}
