import { commands } from 'vscode'
import type { ExtensionModule } from '~/core'
import { Commands } from './commands'
export function transformView() {
    console.log('翻译视图')
}
const m: ExtensionModule = () => {
    return commands.registerCommand(Commands.transform, transformView)
}

export default m
