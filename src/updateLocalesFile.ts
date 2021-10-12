import type { TextEditor } from 'vscode'
import type { ReturnReadLocalesInfo } from '~/core'
import { window } from 'vscode'
import { dirname } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { beforeWriteJson } from '~/handlers/update'
import { readLocalesInfo } from '~/core'
import Config from '~/core/Config'
export function updateLocalesFile() {
    const editor: TextEditor | undefined = window.activeTextEditor
    if (!editor) return
    const { fsPath } = editor.document.uri
    const defaultLocalesPath = Config.localesPath

    const localesFileInfo = readLocalesInfo({
        fsPath,
        defaultLocalesPath,
        showError: false
    }) as ReturnReadLocalesInfo[]

    localesFileInfo.forEach(locales => {
        const { exist, localesPath } = locales
        if (!exist) {
            !existsSync(dirname(localesPath)) && mkdirSync(dirname(localesPath))
            beforeWriteJson(editor, localesPath)
        }
        else {
            beforeWriteJson(editor, localesPath)
        }
    })
}
