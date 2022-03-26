import type { RefactorTextResult } from '.'
import type { ExtractorResult } from '../extractors/base'
import { window } from 'vscode'
import { Global } from '.'

function commit(extracted: ExtractorResult, keypath: string, caller: string) {
    const { start, end, range, isDynamic, isSetup, isJsx, fullStart, fullEnd, fullRange, attrName, type } = extracted
    const replaceTo = `${caller}('${keypath}')`
    let refactorTextResult: RefactorTextResult | null = {
        replaceTo,
        start,
        end,
        range
    }

    switch (type) {
        case 'html-inline':
            if (!isDynamic) { refactorTextResult.replaceTo = `{{ ${replaceTo} }}` }
            if (isDynamic) {
                refactorTextResult.replaceTo = replaceTo
                refactorTextResult.range = range.with({
                    start: range.start.translate(0, -1),
                    end: range.end.translate(0, 1),
                })
            }
            break
        case 'html-inline-template':
            refactorTextResult.replaceTo = `\${${replaceTo}}`
            break
        case 'html-attribute':
            if (isDynamic) {
                refactorTextResult.range = range.with({
                    start: range.start.translate(0, -1),
                    end: range.end.translate(0, 1),
                })
            }
            if (!isDynamic && fullRange) {
                refactorTextResult = {
                    replaceTo: `:${attrName}="${replaceTo}"`,
                    start: fullStart as number,
                    end: fullEnd as number,
                    range: fullRange
                }
            }
            break
        case 'html-attribute-template':
            refactorTextResult.replaceTo = `\${${replaceTo}}`
            break
        case 'js-string':
            if (!isSetup && !isJsx) { refactorTextResult.replaceTo = `this.${replaceTo}` }

            refactorTextResult.range = range.with({
                start: range.start.translate(0, -1),
                end: range.end.translate(0, 1),
            })
            break
        case 'js-template':
            if (!isSetup) { refactorTextResult.replaceTo = `\${this.${replaceTo}}` }

            if (isSetup || isJsx) { refactorTextResult.replaceTo = `\${${replaceTo}}` }

            break
        case 'jsx-text':
            refactorTextResult.replaceTo = `{ ${replaceTo} }`
            refactorTextResult.range = range.with({
                start: range.start.translate(0, -1),
                end: range.end.translate(0, 1),
            })
            break
        default:
            refactorTextResult = null
            break
    }

    return refactorTextResult
}

export function refactorExtract(extracted: ExtractorResult, caller: string): Promise<RefactorTextResult | null> {
    return new Promise((resolve) => {
        const { text } = extracted
        const { loader: { textMappingKey } } = Global
        const items = textMappingKey.get(text)!
        if (!items || !items.length) resolve(null)
        if (items.length > 1) {
            window.showQuickPick(items, {
                ignoreFocusOut: true
            }).then((keypath) => {
                if (!keypath) resolve(null)
                resolve(
                    commit(extracted, keypath as string, caller)
                )
            })
        } else {
            resolve(
                commit(extracted, items[0], caller)
            )
        }
    })
}
