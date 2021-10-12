import { ExtensionContext } from 'vscode'
import { EXT_NAMESPACE } from './meta'
import Config from './core/Config'
Config.extName = EXT_NAMESPACE
import { Log } from './utils/Log'
import ExtractCommand from '~/commands/extract'
import TransformCommand from '~/commands/transform'

export function activate(context: ExtensionContext) {
    Log.info(`🌞 ${Config.extensionName} Activated`)

    ExtractCommand(context)
    TransformCommand(context)
}

// 扩展被停用时
export function deactivate() { }
