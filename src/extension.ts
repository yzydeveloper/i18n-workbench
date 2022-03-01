import { ExtensionContext } from 'vscode'
import { EXT_NAMESPACE } from './meta'
import Config from './core/Config'
import { CurrentFile, Global } from './core'
import { Log } from './utils'
import registerCommand from './commands'

export function activate(context: ExtensionContext) {
    Config.extName = EXT_NAMESPACE
    Config.ctx = context
    Log.info(`🌞 ${Config.extensionName} Activated`)

    Global.init(context)
    CurrentFile.watch(context)

    registerCommand(context)
}

// 扩展被停用时
export function deactivate() { }
