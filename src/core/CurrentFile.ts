import type { ExtensionContext, TextEditor } from 'vscode'
import { workspace, window } from 'vscode'
import { parseComponent } from 'vue-template-compiler'
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
     * 依靠vue-template-complier解析template和script代码块
     * @param currentEditor
     */
    static retrieveSourceLanguage(currentEditor: TextEditor) {
        const doc = currentEditor.document.getText()
        const sfc = parseComponent(doc, { pad: 'space', deindent: false })
        const { template, script } = sfc
        const tagContent = template?.content.match(/(>)([^><]*[\u4E00-\u9FA5]+[^><]*)(<)/gm)
        const tagAttr = template?.content.match(/(<[^\/\s]+)([^<>]+)(\/?>)/gm)
        console.log(tagContent, 'tagContent')
        console.log(tagAttr, 'tagAttr')

        // console.log(template?.content, 'template.content')
        // console.log(script?.content, 'script.content')
    }
}
