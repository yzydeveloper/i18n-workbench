import type { ExtensionContext, Uri } from 'vscode'
import { extname } from 'path'
import { workspace, window } from 'vscode'
import { Extractor } from '~/extractor'
export class CurrentFile {
    static uri: Uri | undefined
    static _extractor: Extractor | null = null
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

    /**
     * 依靠@vue/compiler-sfc解析template和script代码块
     * @param currentEditor
     */
    static async retrieveSourceLanguage() {
        if (this._extractor) {
            const result = await this._extractor.extract({
                id: this.id
            })
            console.log(result, 'result')
        }
    }
}
