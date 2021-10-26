import type { NodePath } from '@babel/traverse'
import { workspace } from 'vscode'
import { Module } from 'module'
import {
    expressionStatement,
    assignmentExpression,
    memberExpression,
    identifier,
    objectExpression
} from '@babel/types'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
export class EcmascriptParser {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) { }

    async load(filepath: string) {
        const document = await workspace.openTextDocument(filepath)
        const texts = await document.getText()
        if (!texts) return {}
        return this.wrapper(texts)
    }

    wrapper(texts: string) {
        const ast = parse(texts, {
            sourceType: 'module'
        })

        traverse(ast, {
            ExportDefaultDeclaration(path: NodePath) {
                path.replaceWith(
                    expressionStatement(
                        assignmentExpression(
                            '=',
                            memberExpression(identifier('module'), identifier('exports')),
                            objectExpression(path.node.declaration.properties),
                        )
                    )
                )
            }
        })
        const module = new Module('my-module')
        const { code } = generate(ast)
        module._compile(code, 'my-module')
        return module.exports
    }
}
