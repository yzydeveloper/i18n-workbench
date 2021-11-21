import type { ExtensionModule } from './../core'
import { commands } from 'vscode'
import { CurrentFile, Workbench } from './../core'
import { Log } from '../utils'
export function extractToFile() {
    CurrentFile.retrieveSourceLanguage()
    Workbench.createWorkbench()
}

const m: ExtensionModule = () => {
    return commands.registerCommand('hero-i18n.extract', () => {
        Log.error('？？？？？？？？？？？？？？？？？？？？？？？？？？')
    })
}

export default m
