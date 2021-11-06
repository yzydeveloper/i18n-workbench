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
    TextNode,
    isText,
    baseParse as parse,
} from '@vue/compiler-core'
import { ParserPlugin, parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        const texts = doc.getText()
        const ast = parse(texts, {
            getTextMode: ({ tag, props }, parent) => {
                if (
                    (!parent && tag !== 'template')
                    || (tag === 'template'
                        && props.some(
                            p =>
                                p.type === 6
                                && p.name === 'lang'
                                && p.value
                                && p.value.content
                                && p.value.content !== 'html'
                        ))
                )
                    return 2
                else
                    return 0
            },
        })
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

    isSimpleExpressionNode(p: ExpressionNode): p is SimpleExpressionNode {
        return p.type === 4
    }

    splitTemplateLiteral(content: string): string[] {
        return content.match(/[\u4E00-\u9FA5]+/gm) ?? []
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
                    this.splitTemplateLiteral(node.content).forEach(t => {
                        words.push(t)
                    })
                }
                else {
                    if (this.isSimpleExpressionNode(node.content)) {
                        const { content } = node.content
                        this.splitTemplateLiteral(content).forEach(t => words.push(t))
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
        return words
    }

    parseJsText(scriptNode: TemplateChildNode) {
        if (scriptNode.type !== 1) return []

        const words: string[] = []
        const plugins: ParserPlugin[] = []
        scriptNode.props.forEach(p => {
            if (p.type === 6) {
                if (p.name === 'lang') {
                    const lang = (p.value && p.value.content) ?? ''
                    const isTs = ['ts', 'tsx'].includes(lang)
                    if (lang === 'tsx')
                        plugins.push('jsx')

                    if (isTs)
                        plugins.push('typescript', 'decorators-legacy')
                }
            }
        })

        for (let i = 0; i < scriptNode.children.length; i++) {
            const { source } = scriptNode.children[i].loc
            const ast = babelParse(source, {
                plugins,
                sourceType: 'module'
            })
            traverse(ast, {
                StringLiteral(path) {
                    const { value } = path.node
                    words.push(value)
                },
                TemplateLiteral: (path) => {
                    const value = path.get('quasis').map(item => item.node.value.raw)
                    value.forEach(v => {
                        this.splitTemplateLiteral(v).forEach(t => {
                            words.push(t)
                        })
                    })
                }
            })
        }
        return words
    }
}
