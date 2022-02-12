import type { ExtensionModule } from './../core'
import { commands } from 'vscode'
import { Commands } from './commands'
import { Workbench } from './../core'

const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.open_workbench, () => {
        Workbench.createWorkbench()
    })
}

export default m
