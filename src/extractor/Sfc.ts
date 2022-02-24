import ExtractorAbstract, { ExtractorResult } from './base'
import { workspace, Range } from 'vscode'
import {
    TemplateChildNode,
    ElementNode,
    AttributeNode,
    DirectiveNode,
    InterpolationNode,
    SimpleExpressionNode,
    ExpressionNode,
    isText,
    baseParse as parse,
} from '@vue/compiler-core'
import { ParserPlugin, parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { CHINESE_REGEX } from './../meta'

export class SfcExtractor extends ExtractorAbstract {
    public readonly id = 'vue'

    async extractor(): Promise<ExtractorResult[]> {
        this.document = await workspace.openTextDocument(this.uri)
        const code = this.document.getText()
        const ast = parse(code, {
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
        const result: ExtractorResult[] = []
        ast.children.forEach(node => {
            if (node.type !== 1) // NODETYPES.ELEMENT
                return
            switch (node.tag) {
                case 'template':
                    this.createExtractorResult(node).forEach(item => result.push(item))
                    break
                case 'script':
                    this.createExtractorResult(node).forEach(item => result.push(item))
                    break
                default:
                    break
            }
        })
        return result
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
        return content.match(CHINESE_REGEX) ?? []
    }

    parseTemplateText(templateNode: TemplateChildNode) {
        const { document } = this
        if (!document) return []

        const { source } = templateNode.loc
        const words: ExtractorResult[] = []
        const visitorAttr = (node: DirectiveNode) => {
            const exp = node.exp
            if (exp && this.isSimpleExpressionNode(exp)) {
                const { content } = exp
                this.splitTemplateLiteral(content).forEach(t => {
                    const start = source.indexOf(t)
                    const end = start + t.length
                    const range = new Range(
                        document.positionAt(start),
                        document.positionAt(end)
                    )
                    words.push({
                        id: this.id,
                        text: t,
                        start,
                        end,
                        range,
                        isDynamic: true,
                        type: 'html-attribute'
                    })
                })
            }
        }
        const visitor = (node: TemplateChildNode) => {
            if (isText(node)) {
                if (!this.isInterPolation(node)) {
                    this.splitTemplateLiteral(node.content).forEach(t => {
                        const start = source.indexOf(t)
                        const end = start + t.length
                        const range = new Range(
                            document.positionAt(start),
                            document.positionAt(end)
                        )
                        words.push({
                            id: this.id,
                            text: t,
                            start,
                            end,
                            range,
                            type: 'html-inline'
                        })
                    })
                }
                else {
                    if (this.isSimpleExpressionNode(node.content)) {
                        const { content } = node.content
                        this.splitTemplateLiteral(content).forEach(t => {
                            const start = source.indexOf(t)
                            const end = start + t.length
                            const range = new Range(
                                document.positionAt(start),
                                document.positionAt(end)
                            )
                            words.push({
                                id: this.id,
                                text: t,
                                start,
                                end,
                                range,
                                isDynamic: true,
                                type: 'html-inline'
                            })
                        })
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
                        const { loc, value } = inlineNode // name="xxx"
                        if (value) {
                            const {
                                loc: {
                                    start: { offset }
                                },
                                content
                            } = value
                            const start = offset + 1
                            const end = offset + 1 + content.length
                            const range = new Range(
                                document.positionAt(start),
                                document.positionAt(end)
                            )
                            words.push({
                                id: this.id,
                                text: content,
                                start,
                                end,
                                range,
                                fullText: loc.source,
                                fullStart: loc.start.offset,
                                fullEnd: loc.end.offset,
                                type: 'html-attribute'
                            })
                        }
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
        const { document } = this
        if (!document) return []
        if (scriptNode.type !== 1) return []

        const words: ExtractorResult[] = []
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
            const { source, start: { offset } } = scriptNode.children[i].loc
            const ast = babelParse(source, {
                plugins,
                sourceType: 'module'
            })
            traverse(ast, {
                StringLiteral: (path) => {
                    const { value, start, end } = path.node
                    if (!start || !end) return
                    if (path.findParent(p => p.isImportDeclaration())) return
                    const range = new Range(
                        /** 加一，减一的原因是，去除引号 */
                        document.positionAt(start + 1 + offset),
                        document.positionAt(end - 1 + offset)
                    )
                    words.push({
                        id: this.id,
                        text: value,
                        start,
                        end,
                        range,
                        type: 'js-string'
                    })
                },
                TemplateLiteral: (path) => {
                    if (path.findParent(p => p.isImportDeclaration())) return
                    const value = path.get('quasis').map(item => item.node.value.raw)
                    value.forEach(v => {
                        this.splitTemplateLiteral(v).forEach(t => {
                            // 1 是减去了 `
                            const start = source.indexOf(t) - 1
                            const end = start + t.length
                            const range = new Range(
                                document.positionAt(start + offset),
                                document.positionAt(end + offset)
                            )
                            words.push({
                                id: this.id,
                                text: t,
                                start,
                                end,
                                range,
                                type: 'js-template'
                            })
                        })
                    })
                }
            })
        }
        return words
    }

    createExtractorResult(node: ElementNode) {
        const { tag } = node
        if (tag === 'template')
            return this.parseTemplateText(node)

        if (tag === 'script')
            return this.parseJsText(node)
        return []
    }
}
