import type { TextEditor } from 'vscode'
import type { LocalesPath, PuidType } from '~/core'
import Config from '~/core/Config'
import { retrieveCN } from '~/core'
/**
 * 写入文件前
 * @param currentEditor
 * @param localesPath
 */
export function beforeWriteJson(currentEditor: TextEditor, localesPath: LocalesPath) {
    const puidType = Config.puidType
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
