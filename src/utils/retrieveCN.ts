import type { TextEditor } from 'vscode'
import type { PuidType } from '.'
import Puid from 'puid'
import {
    commentRegexp,
    warnRegexp,
    angleBracketSpaceRegexp,
    propertyRegexp,
    scriptRegexp,
    spaceRegexp,
    quotationRegexp
} from '.'
import { getRange } from '.'

type Words = string[]
interface GetWord {
    lineText: string
    reg: RegExp
    resoloveReg: RegExp
    initWords: Words
}

export function getWord({ lineText, reg, resoloveReg, initWords = [] }: GetWord) {
    const words = lineText.match(reg)?.reduce((result, current) => {
        if (!current.match(warnRegexp)) {
            const word = reg === propertyRegexp ? current.split('=')[1].replace(resoloveReg, '') : current.replace(resoloveReg, '')
            result.push(word)
        }
        return result
    }, [] as Words).concat(initWords) || []
    return words
}

export function newWords(arr: Array<string>, puid) {
    return arr.reduce((p, c) => {
        const id = puid.generate()
        p[id] = c
        return p
    }, {})
}
export function retrieveCN(currentEditor: TextEditor, puidType: PuidType) {
    const { lineCount, languageId, lineAt } = currentEditor.document
    const isJavascript = languageId === 'javascript'
    const isVue = languageId === 'vue'
    const { template, script } = getRange(currentEditor)

    const lines = []

    for (let i = 0; i < lineCount; i++) {
        const lineText = lineAt(i).text
        let cnWordArr: string[] = []

        // 跳过单行注释
        if (lineText.match(commentRegexp))
            continue

        if (isJavascript) {
            cnWordArr = getWord({
                lineText,
                reg: scriptRegexp,
                resoloveReg: quotationRegexp,
                initWords: cnWordArr
            })
        }

        if (isVue) {
            const inVueTemplate = i <= template.end && i >= template.begin
            const inVueScript = i <= script.end && i >= script.begin
            if (inVueTemplate) {
                /*
                vue template 三种位置
                1. 标签,空行之间
                2.标签属性
                3.{{""}}之间
                */
                const inAngleBracketSpacet = lineText.match(angleBracketSpaceRegexp)
                const inProperty = lineText.match(propertyRegexp)
                const inTemplateScript = lineText.match(scriptRegexp)
                if (inAngleBracketSpacet) {
                    cnWordArr = getWord({
                        lineText,
                        reg: angleBracketSpaceRegexp,
                        resoloveReg: spaceRegexp,
                        initWords: cnWordArr
                    })
                }
                else if (inProperty) {
                    cnWordArr = getWord({
                        lineText,
                        reg: propertyRegexp,
                        resoloveReg: quotationRegexp,
                        initWords: cnWordArr
                    })
                }
                else if (inTemplateScript) {
                    cnWordArr = getWord({
                        lineText,
                        reg: scriptRegexp,
                        resoloveReg: quotationRegexp,
                        initWords: cnWordArr
                    })
                }
            }
            if (inVueScript) {
                cnWordArr = getWord({
                    lineText,
                    reg: scriptRegexp,
                    resoloveReg: quotationRegexp,
                    initWords: cnWordArr
                })
            }
        }

        lines.push(...cnWordArr)
    }

    const puid = new Puid(puidType === 'short')
    const result = newWords(Array.from(new Set(lines)), puid)
    return result
}
