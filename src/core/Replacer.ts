import { window, workspace, WorkspaceEdit } from 'vscode'
import { CurrentFile, refactorExtract } from '.'

export class Replacer {
    static queue: ReturnType<typeof refactorExtract>[] = []

    static async refactorDocument() {
        if (!window.activeTextEditor) return
        const { document } = window.activeTextEditor
        const { extractorResult } = CurrentFile
        const edit = new WorkspaceEdit()

        this.queue = extractorResult.map(i => {
            return refactorExtract(i)
        })
        Promise.all(
            this.queue
        ).then(result => {
            result.forEach(i => {
                if (i) {
                    const { text, range } = i
                    edit.replace(
                        document.uri,
                        range,
                        text
                    )
                }
            })
            workspace.applyEdit(edit)
        })
    }
}
