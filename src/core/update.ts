import type { TextEditor } from 'vscode'
import type { LocalesPath } from './../lib/constant'
import { readSetting } from './../lib/utils'
/**
 * 写入文件前
 * @param currentEditor
 * @param localesPath
 */
export function beforeWriteJson(currentEditor: TextEditor, localesPath: LocalesPath) {
    console.log(localesPath, 'localesPath')
    const puidType = readSetting({
        fsPath: currentEditor.document.uri.fsPath,
        key: 'puidType'
    })
}
export function writeLocalesFile() { }
