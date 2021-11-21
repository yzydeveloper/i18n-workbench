import { ExtensionContext } from 'vscode'
import { EXT_NAMESPACE } from './meta'
import Config from './core/Config'
import { CurrentFile, Global } from './core'
Config.extName = EXT_NAMESPACE
import { Log } from './utils'
import ExtractCommand from './commands/extract'
import ConfigLocaleCommand from './commands/configLocalePaths'

export function activate(context: ExtensionContext) {
    Log.info(`🌞 ${Config.extensionName} Activated`)
    Config.ctx = context
    Global.init(context)
    CurrentFile.watch(context)

    ExtractCommand(context)
    ConfigLocaleCommand(context)
}

// 扩展被停用时
export function deactivate() { }
