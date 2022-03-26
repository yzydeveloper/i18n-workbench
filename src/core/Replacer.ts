import { window, workspace, WorkspaceEdit } from 'vscode'
import { CurrentFile, refactorExtract } from '.'

export class Replacer {
    static queue: ReturnType<typeof refactorExtract>[] = []

    static async refactorDocument(caller: string) {
        if (!window.activeTextEditor) return
        const { document } = window.activeTextEditor
        const { extractorResult } = CurrentFile
        const edit = new WorkspaceEdit()

        this.queue = extractorResult.map(i => refactorExtract(i, caller))

        Promise.all(
            this.queue
        ).then(result => {
            result.forEach(i => {
                if (i) {
                    const { replaceTo, range } = i
                    edit.replace(
                        document.uri,
                        range,
                        replaceTo
                    )
                }
            })
            workspace.applyEdit(edit).then(() => {
                this.queue = []
            })
        })
    }
}
