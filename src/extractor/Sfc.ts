import ExtractorAbstract, { ExtractorOptions, ExtractorResult } from './base'
import { workspace } from 'vscode'
import {
    TemplateChildNode,
    ElementNode,
    AttributeNode,
    DirectiveNode,
    InterpolationNode,
    SimpleExpressionNode,
    ExpressionNode,
    CompoundExpressionNode,
    TextNode,
    isText,
    baseParse as parse,
} from '@vue/compiler-core'
import { parse as _parse } from '@babel/parser'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        const texts = doc.getText()
        const ast = parse(texts)
        ast.children.forEach(node => {
            if (node.type !== 1) // NODETYPES.ELEMENT
                return

            switch (node.tag) {
                case 'template':
                    this.parseTemplateText(node)
                    break
                case 'script':
                    this.parseJsText(node)
                    break
                default:
                    break
            }
        })
        return options
    }

    isVBind(p: ElementNode['props'][0]): p is DirectiveNode {
        return p.type === 7 && p.name === 'bind'
    }

    isProp(p: ElementNode['props'][0]): p is AttributeNode {
        return p.type === 6 && !['class', 'id'].includes(p.name)
    }

    isInterPolation(p: TemplateChildNode): p is InterpolationNode {
        return p.type === 5
    }

    isCompoundExpression(p: ExpressionNode): p is CompoundExpressionNode {
        return p.type === 8
    }

    isSimpleExpressionNode(p: ExpressionNode): p is SimpleExpressionNode {
        return p.type === 4
    }

    splitTemplateLiteral(content: string): string[] {
        return content.match(/[\u4E00-\u9FA5]+/g) ?? []
    }

    parseTemplateText(templateNode: TemplateChildNode) {
        const words: string[] = []
        const visitorAttr = (node: DirectiveNode) => {
            const exp = node.exp as ExpressionNode
            if (this.isSimpleExpressionNode(exp)) {
                const { content } = exp
                this.splitTemplateLiteral(content).forEach(c => words.push(c))
            }
        }
        const visitor = (node: TemplateChildNode) => {
            if (isText(node)) {
                if (!this.isInterPolation(node)) {
                    // TODO 考虑文本换行
                    words.push(node.content)
                }
                else {
                    if (this.isSimpleExpressionNode(node.content)) {
                        const { content } = node.content
                        this.splitTemplateLiteral(content).forEach(c => words.push(c))
                    }

                    // TODO
                    // if(this.isCompoundExpression(node.content)) {
                    // }
                }
            }
            if (node.type === 1) {
                node.props.forEach(inlineNode => {
                    if (this.isVBind(inlineNode))
                        visitorAttr(inlineNode)

                    if (this.isProp(inlineNode)) {
                        const { content } = inlineNode.value as TextNode
                        words.push(content)
                    }
                })

                const _node = node.children
                _node.forEach(visitor)
            }
        }
        visitor(templateNode)
        console.log(words, 'words')
    }

    parseJsText(scriptNode: TemplateChildNode) {
        if(scriptNode.type !== 1) return []
        for (let i = 0; i < scriptNode.children.length; i++) {

        }
    }
}
