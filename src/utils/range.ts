import type { TextEditor } from 'vscode'
import { Position } from 'vscode'
import {
    templateBeginRegexp,
    templateEndRegexp,
    scriptBeginRegexp,
    scripteEndRegexp,
} from '.'

export interface BeginEnd {
    begin: number
    end: number
}
export interface CellRange {
    editor: TextEditor
    regex: RegExp
    line: number
}

interface Range {
    template: BeginEnd
    script: BeginEnd
}

export const getCellRange = ({ editor, regex, line }: CellRange) => {
    return editor.document.getWordRangeAtPosition(new Position(line, 0), regex)
}
/**
 * 获取template和script的行数范围
 * @param editor
 * @returns
 */
export function getRange(editor: TextEditor): Range {
    const range: Range = {
        template: {
            begin: 0,
            end: 0
        },
        script: {
            begin: 0,
            end: 0
        },
    }

    const lineCount = editor.document.lineCount

    for (let i = 0; i < lineCount; i++) {
        const templateBegin = getCellRange({
            editor,
            regex: templateBeginRegexp,
            line: i,
        })
        const templateEnd = getCellRange({
            editor,
            regex: templateEndRegexp,
            line: i,
        })
        const scriptBegin = getCellRange({
            editor,
            regex: scriptBeginRegexp,
            line: i,
        })
        const scriptEnd = getCellRange({
            editor,
            regex: scripteEndRegexp,
            line: i,
        })
        if (templateBegin)
            range.template.begin = templateBegin.start.line

        else if (templateEnd)
            range.template.end = templateEnd.start.line

        if (scriptBegin)
            range.script.begin = scriptBegin.start.line

        else if (scriptEnd)
            range.script.end = scriptEnd.start.line
    }
    return range
}
