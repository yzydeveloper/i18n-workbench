import type { NodePath } from '@babel/traverse'
import { workspace } from 'vscode'
import {
    expressionStatement,
    assignmentExpression,
    memberExpression,
    identifier,
    objectExpression
} from '@babel/types'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
export class EcmascriptParser {
    constructor(
        public readonly id: 'js' | 'ts' = 'js'
    ) { }

    async load(filepath: string) {
        const regex = /export default/
        const document = await workspace.openTextDocument(filepath)
        const texts = await document.getText()
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
        console.log(ast, 'ast')
        if (!texts) return {}
        // eslint-disable-next-line no-eval
        return (0, eval)(`(${texts.replace(regex, '')})`)
    }
}
