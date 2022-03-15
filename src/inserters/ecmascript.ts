import { writeFileSync, readFileSync } from 'fs'
import { parse, parseExpression } from '@babel/parser'
import traverse from '@babel/traverse'
import { stringLiteral, objectProperty, identifier, isExportDefaultDeclaration, isObjectProperty, isIdentifier, isStringLiteral } from '@babel/types'
import generate from '@babel/generator'
import { unflatten } from 'flat'
import Inserter from './base'
import { SPECIAL_CHARACTERS } from './../meta'
export class EcmascriptInserter extends Inserter {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) {
        super()
    }

    async insert(filepath: string, value: object) {
        const file = this.files[filepath]
        const { flattenValue } = file

        const text = readFileSync(filepath, 'utf-8') || 'export default {}'
        const ast = parse(text, {
            sourceType: 'module'
        })

        const mergeObject = unflatten<object, Record<string, object | string>>({
            ...flattenValue,
            ...value
        })
        traverse(ast, {
            Program: {
                enter(path) {
                    path.traverse({
                        ObjectExpression(p) {
                            if (isExportDefaultDeclaration(p.parent)) {
                                const { properties } = p.node
                                properties.forEach(propertie => {
                                    if (isObjectProperty(propertie) && (isIdentifier(propertie.key) || isStringLiteral(propertie.key))) {
                                        const propertieKey = propertie.key
                                        let key
                                        if (isIdentifier(propertieKey))
                                            key = propertieKey.name
                                        if (isStringLiteral(propertieKey))
                                            key = propertieKey.value
                                        if (!key) return
                                        const value = mergeObject[key]
                                        const expression = typeof value === 'object' ? parseExpression(JSON.stringify(mergeObject[key])) : stringLiteral(value)
                                        if (mergeObject[key] || mergeObject[key] === '') {
                                            propertie.value = expression
                                            Reflect.deleteProperty(mergeObject, key)
                                        }
                                    }
                                })
                                Object.keys(mergeObject).forEach(item => {
                                    const value = mergeObject[item]
                                    let key = item
                                    if (key.match(SPECIAL_CHARACTERS))
                                        key = `'${key}'`

                                    const expression = value ? parseExpression(JSON.stringify(value)) : stringLiteral(value)
                                    properties.push(
                                        objectProperty(identifier(key), expression)
                                    )
                                })
                            }
                        }
                    })
                }
            },
            ObjectProperty(p) {
                const { node } = p
                const { extra } = node.key

                // 只替换不包含特殊字符的
                if (extra && typeof extra.raw === 'string' && !extra.raw.match(SPECIAL_CHARACTERS))
                    extra.raw = extra.raw.replace(/"/g, '')
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
