import type { TextEditor } from 'vscode'
import type { LocalesPath, PuidType } from './../lib/constant'
import { retrieveCN } from './../lib/retrieveCN'
import { readSetting } from './../lib/utils'
/**
 * 写入文件前
 * @param currentEditor
 * @param localesPath
 */
export function beforeWriteJson(currentEditor: TextEditor, localesPath: LocalesPath) {
    const puidType = readSetting({
        fsPath: currentEditor.document.uri.fsPath,
        key: 'puidType'
    }) as PuidType
    writeLocalesFile(currentEditor, localesPath, puidType)
}
/**
 * 写入国际化文件
 * @param currentEditor
 * @param localesPath
 * @param puidType
 */
export function writeLocalesFile(currentEditor: TextEditor, localesPath: LocalesPath, puidType: PuidType) {
    retrieveCN(currentEditor, puidType)
}
