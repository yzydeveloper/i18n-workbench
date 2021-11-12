import type { ExtensionModule } from '~/core'
import { commands } from 'vscode'
import { Commands } from './commands'
import { CurrentFile } from '~/core'
import { Workbench } from '~/core/Workbench'
export function extractToFile() {
    CurrentFile.retrieveSourceLanguage()
    Workbench.createWorkbench()
}

const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.extract, extractToFile)
}

export default m
