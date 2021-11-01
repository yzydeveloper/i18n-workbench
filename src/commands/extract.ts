import type { TextEditor } from 'vscode'
import type { ExtensionModule } from '~/core'
import { window, commands } from 'vscode'
import { Commands } from './commands'
import { CurrentFile } from '~/core'
export function extractToFile() {
    const editor: TextEditor | undefined = window.activeTextEditor
    if (!editor) return

    CurrentFile.retrieveSourceLanguage()
}

const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.extract, extractToFile)
}

export default m
