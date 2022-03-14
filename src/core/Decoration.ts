import type { TextEditorDecorationType } from 'vscode'
import type { ExtractorResult } from './../extractors/base'
import { window } from 'vscode'

export const decorator: TextEditorDecorationType = window.createTextEditorDecorationType({
    color: '#FF4400'
})

export function set(options: ExtractorResult[]) {
    const { activeTextEditor } = window
    if (!activeTextEditor || !decorator) return
    const range = options.map((i) => i.range)
    activeTextEditor.setDecorations(decorator, range)
}

export function clear() {
    const { activeTextEditor } = window
    if (!activeTextEditor || !decorator) return
    activeTextEditor.setDecorations(decorator, [])
}
