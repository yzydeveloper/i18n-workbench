import type { ExtensionContext, TextEditor } from 'vscode'
import { workspace, window } from 'vscode'
export class CurrentFile {
    static watch(ctx: ExtensionContext) {
        ctx.subscriptions.push(workspace.onDidSaveTextDocument(e => {
            console.log(e, 'onDidSaveTextDocument')
        }))
        ctx.subscriptions.push(workspace.onDidChangeTextDocument(e => {
            console.log(e, 'onDidChangeTextDocument')
        }))
        ctx.subscriptions.push(window.onDidChangeActiveTextEditor(e => {
            console.log(e, 'onDidChangeActiveTextEditors')
        }))
        // ctx.subscriptions.push(Global.onDidChangeLoader(() => {
        //     this.invalidate()
        //     this.updateLoaders()
        //     this._composed_loader.fire('{Config}')
        // }))
        // ctx.subscriptions.push(Analyst.watch())
        // this.update(window.activeTextEditor?.document.uri)
    }

    static retrieveSourceLanguage(currentEditor: TextEditor) {
        console.log(currentEditor)
    }
}
