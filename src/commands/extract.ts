import type { TextEditor } from 'vscode'
import type { ReturnReadLocalesInfo, ExtensionModule } from '~/core'
import { window, commands } from 'vscode'
import { dirname } from 'path'
import { mkdirSync, existsSync } from 'fs'
import { Commands } from './commands'
import Config from '~/core/Config'
import { beforeWriteJson } from './manipulations/writeFile'
import { readLocalesInfo } from '~/core'

export function extractToFile() {
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

const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.extract, extractToFile)
}

export default m
