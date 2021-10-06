import type { TextEditor } from 'vscode'
import type { PuidType } from '~/lib/constant'
import { commentRegexp } from '~/lib/constant'
import { getRange } from '~/engines/range'
export function getWord() { }

export function retrieveCN(currentEditor: TextEditor, puidType: PuidType) {
    const { lineCount, languageId, lineAt } = currentEditor.document
    const isJavascript = languageId === 'javascript'
    const isVue = languageId === 'vue'
    const { template, script } = getRange(currentEditor)

    console.log(template, 'template')
    console.log(script, 'script')

    const lines = []
    for (let i = 0; i < lineCount; i++) {
        const lineText = lineAt(i).text

        // 跳过单行注释
        if (lineText.match(commentRegexp))
            continue

        if (isJavascript)
            console.log('isJavascript')

        if (isVue)
            console.log('isVue')

        console.log(lineText)
    }
}
