import { commands, ExtensionContext } from 'vscode'
import { updateLocalesFile } from './updateLocalesFile'
import { EXT_NAMESPACE } from './meta'
import Config from './core/Config'
Config.extName = EXT_NAMESPACE
import { Log } from './utils/Log'

export function activate(context: ExtensionContext) {
    Log.info(`🌞 ${Config.extensionName} Activated`)

    commands.registerCommand('hero-i18n.update', updateLocalesFile)
    commands.registerCommand('hero-i18n.transform', () => {
        console.log('hero')
    })
    console.log(context)
}

// 扩展被停用时
export function deactivate() { }
