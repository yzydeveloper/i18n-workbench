import type { TextEditor } from 'vscode'
import type { ReturnReadLocalesInfo } from '~/utils'
import { window } from 'vscode'
import { dirname } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { beforeWriteJson } from '~/handlers/update'
import { readSetting, readLocalesInfo } from '~/utils'
export function updateLocalesFile() {
    const editor: TextEditor | undefined = window.activeTextEditor
    if (!editor) return
    const { fsPath } = editor.document.uri
    const defaultLocalesPath = readSetting({
        fsPath,
        key: 'localesPath'
    }) as string

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
