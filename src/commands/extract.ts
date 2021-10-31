import type { TextEditor } from 'vscode'
import type { ExtensionModule } from '~/core'
import { window, commands } from 'vscode'
import { Commands } from './commands'
import { CurrentFile, Global } from '~/core'
export function extractToFile() {
    const editor: TextEditor | undefined = window.activeTextEditor
    if (!editor) return

    console.log(CurrentFile, 'CurrentFile')
    console.log(Global.loader, 'Global')
    CurrentFile.retrieveSourceLanguage(window.activeTextEditor)
}

const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.extract, extractToFile)
}

export default m
