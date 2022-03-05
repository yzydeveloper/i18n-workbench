import type { RefactorTextResult } from '.'
import type { ExtractorResult } from '../extractor/base'
import { window } from 'vscode'

function commit(extracted: ExtractorResult) {
    const { text, start, end, range, type } = extracted
    let refactorTextResult: RefactorTextResult | null = null

    switch (type) {
        case 'html-inline':
            // const replaceTo =
            refactorTextResult = {
                text: `{{ this.$i18n(${text}) }}`,
                start,
                end,
                range
            }
            break
        case 'html-inline-template':

            break
        case 'html-attribute':

            break
        case 'js-string':

            break

        default:
            break
    }

    return refactorTextResult
}

export function refactorExtract(extracted: ExtractorResult): Promise<RefactorTextResult | null> {
    return new Promise((resolve) => {
        const { text } = extracted
        if (text) {
            window.showQuickPick(['$i18n']).then(() => {
                resolve(
                    commit(extracted)
                )
            })
        }
        else {
            resolve(
                commit(extracted)
            )
        }
    })
}
