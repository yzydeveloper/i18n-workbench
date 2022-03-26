import type { ExtensionModule } from './../core'
import path from 'path'
import { Uri, workspace, window, commands } from 'vscode'
import fg from 'fast-glob'
import { Commands } from './commands'
import Config from './..//core/Config'
import { Log } from './../utils'

export class ConfigLocalesGuide {
    static async prompt() {
        const okText = '配置'
        const result = await window.showInformationMessage(
            '配置当前项目的翻译文件夹',
            okText,
        )

        if (result !== okText) { return }

        this.config()
    }

    static async config() {
        const dirs = await this.pickDir()

        Config.updateLocalesPath(dirs[0])

        this.success()
    }

    static async pickDir(): Promise<string[]> {
        const rootPath = workspace.workspaceFolders?.[0]?.uri.fsPath
        if (!rootPath) { return [] }

        const dirs = await window.showOpenDialog({
            defaultUri: Uri.file(rootPath),
            canSelectFolders: true,
        })

        if (!dirs) { return [] }

        return dirs
            .map((item) => {
                if (process.platform === 'win32') { return item.path.slice(1) }
                return item.path
            })
            .map(pa => path
                .relative(rootPath, pa)
                .replace(/\\/g, '/'))
    }

    static async success() {
        await window.showInformationMessage('翻译文件夹配置成功')
    }

    static async autoSet() {
        const rootPath = workspace.workspaceFolders?.[0]?.uri.fsPath
        if (!rootPath) { return }

        const pattern = ['**/**/(locales|locale|i18n|lang|langs|language|languages|messages)']
        const result: string[] = await fg(pattern, {
            cwd: rootPath,
            ignore: [
                '**/node_modules',
                '**/dist',
            ],
            onlyDirectories: true,
        })

        if (result.length) {
            Config.updateLocalesPath(result[0])

            await window.showInformationMessage(
                `自动检测到翻译文件夹 ${result}`
            )
        } else {
            Log.warn('没有找到翻译文件夹，插件已停用', false)
            this.prompt()
        }
    }
}
const m: ExtensionModule = () => [
    commands.registerCommand(
        Commands.config_locales_auto,
        () => ConfigLocalesGuide.autoSet()
    ),
    commands.registerCommand(
        Commands.config_locales,
        () => ConfigLocalesGuide.config()
    ),
]

export default m
