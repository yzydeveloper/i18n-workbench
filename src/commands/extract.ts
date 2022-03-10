import type { ExtensionModule } from './../core'
import { commands, window } from 'vscode'
import { Commands } from './commands'
import { Workbench, Replacer, Global } from './../core'

const m: ExtensionModule = () => {
    return [
        commands.registerCommand(Commands.open_workbench, () => {
            Workbench.createWorkbench()
        }),
        commands.registerCommand(Commands.replace_with, async () => {
            let name = Global.callFunctionName
            if (!name) {
                name = await window.showInputBox({
                    value: '',
                    placeHolder: '请输入系统中的国际化调用函数名称',
                    ignoreFocusOut: true
                }) ?? ''
                Global.callFunctionName = name
            }
            name && Replacer.refactorDocument(name)
        }),
        commands.registerCommand(Commands.config_call_function_name, () => {
            window.showInputBox({
                value: '',
                placeHolder: '请输入系统中的国际化调用函数名称',
                ignoreFocusOut: true
            }).then(name => {
                if (Global.callFunctionName !== name)
                    Global.callFunctionName = name ?? ''
            })
        })
    ]
}

export default m
