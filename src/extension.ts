import { commands, ExtensionContext } from 'vscode'
import { updateLocalesFile } from './updateLocalesFile'
// 扩展第一次执行命令时
export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "hero-i18n" is now active!')
    // 提取
    commands.registerCommand('hero.update', updateLocalesFile)
    // 替换
    commands.registerCommand('hero.transform', () => {
        console.log('hero')
    })
    // 查看
    commands.registerCommand('hero.show', () => {
        console.log('show')
    })
    console.log(context)
}

// 扩展被停用时
export function deactivate() { }
