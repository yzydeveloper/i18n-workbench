import type { ExtensionContext, TextEditor } from 'vscode'
import { workspace, window } from 'vscode'
import { parse } from '@vue/compiler-sfc'
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

    /**
     * 依靠@vue/compiler-sfc解析template和script代码块
     * @param currentEditor
     */
    static retrieveSourceLanguage(currentEditor: TextEditor) {
        const doc = currentEditor.document.getText()
        const { descriptor } = parse(doc)
        const { template, script } = descriptor
        console.log(template?.content, 'template')
        console.log(script?.content, 'script')
        console.log(template, 'template')
        console.log(script, 'script')
        const tagContent = template?.content.match(/(>)([^><]*[\u4E00-\u9FA5]+[^><]*)(<)/gm)
        const tagAttr = template?.content.match(/(<[^\/\s]+)([^<>]+)(\/?>)/gm)
        console.log(tagContent, 'tagContent')
        console.log(tagAttr, 'tagAttr')
    }
}
