import type { ExtensionModule } from './../core'
import { commands, window } from 'vscode'
import { Commands } from './commands'
import { Workbench, Replacer } from './../core'

const m: ExtensionModule = () => {
    return [
        commands.registerCommand(Commands.open_workbench, () => {
            Workbench.createWorkbench()
        }),
        commands.registerCommand(Commands.replace_with, () => {
            window.showInputBox({
                value: '$i18n',
                prompt: '请输入系统中的国际化方法名称',
                ignoreFocusOut: true
            }).then(value => {
                value && Replacer.refactorDocument(value)
            })
        })
    ]
}

export default m
