import { workspace } from 'vscode'
import { writeFileSync } from 'fs'
import { parse, parseExpression } from '@babel/parser'
import traverse from '@babel/traverse'
import { isExportDefaultDeclaration } from '@babel/types'
import generate from '@babel/generator'
import { unflatten } from 'flat'
import { SPECIAL_CHARACTERS } from './../meta'
import Inserter from './base'
export class EcmascriptInserter extends Inserter {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) {
        super()
    }

    async insert(filepath: string, value: object) {
        const file = this.files[filepath]
        const { flattenValue } = file

        const document = await workspace.openTextDocument(filepath)
        const text = document.getText() || 'export default {}'
        const ast = parse(text, {
            sourceType: 'module'
        })

        const mergeObject = unflatten<object, object>({
            ...flattenValue,
            ...value
        })

        const expression = parseExpression(JSON.stringify(mergeObject))
        traverse(ast, {
            Program: {
                enter(path) {
                    path.traverse({
                        ObjectExpression(p) {
                            if (isExportDefaultDeclaration(p.parent))
                                p.replaceWith(expression)
                        },
                        ObjectProperty(p) {
                            const { node } = p
                            const { extra } = node.key

                            // 只替换不包含特殊字符的
                            if (extra && typeof extra.raw === 'string' && !extra.raw.match(SPECIAL_CHARACTERS))
                                extra.raw = extra.raw.replace(/"/g, '')
                        }
                    })
                    path.skip()
                }
            }
        })

        const { code } = generate(ast, {
            compact: 'auto',
            jsescOption: {
                quotes: 'single',
                minimal: true
            }
        }, text)
        writeFileSync(filepath, code)

        return Promise.resolve({})
    }
}
