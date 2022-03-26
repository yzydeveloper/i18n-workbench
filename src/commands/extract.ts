import type { ExtensionModule } from './../core'
import { commands, window } from 'vscode'
import { Commands } from './commands'
import { Workbench, Replacer, Global } from './../core'

const m: ExtensionModule = () => [
    commands.registerCommand(Commands.open_workbench, () => {
        Workbench.createWorkbench()
    }),
    commands.registerCommand(Commands.replace_with, async () => {
        let name = Global.callFunctionName
        if(name) Replacer.refactorDocument(name)

        if (!name) {
            name = await window.showInputBox({
                value: '',
                placeHolder: '请输入系统中的国际化调用函数名称',
                ignoreFocusOut: true
            }) ?? ''
            Global.callFunctionName = name
            name && Replacer.refactorDocument(name)
            window.showInformationMessage(`配置国际化调用函数名称成功 ${name}`)
        }
    }),
    commands.registerCommand(Commands.config_call_function_name, async () => {
        const name = await window.showInputBox({
            value: '',
            placeHolder: '请输入系统中的国际化调用函数名称',
            ignoreFocusOut: true
        })
        if (Global.callFunctionName !== name) {
            Global.callFunctionName = name ?? ''
            await window.showInformationMessage(
                    `配置国际化调用函数名称成功 ${name}`
            )
        }
    })
]

export default m
