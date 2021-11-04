import ExtractorAbstract, { ExtractorOptions, ExtractorResult } from './base'
import { workspace } from 'vscode'
import {
    isText,
    // isTemplateNode,
    TemplateChildNode,
    baseParse as parse,
} from '@vue/compiler-core'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        const texts = doc.getText()
        const ast = parse(texts)
        ast.children.forEach(node => {
            if (node.type !== 1) // NODETYPES.ELEMENT
                return
            console.log(node, 'node')

            switch (node.tag) {
                case 'template':
                    this.parseTemplateText(node)
                    break
                case 'script':
                    break
                default:
                    break
            }
        })
        console.log(options, 'options')
        return {
            id: 'vue'
        }
    }

    parseTemplateText(templateNode: TemplateChildNode) {
        const visitor = (node: TemplateChildNode) => {
            // enum {
            // InterpolationNode = 5
            // TEXTNODE = 2
            // COMMENT = 3
            // ELEMENT = 1
            // }
            if (isText(node))
                console.log(node, 'node>>isText')

            if (node.type === 1) {
                const _node = node.children
                _node.forEach(visitor)
            }
        }

        visitor(templateNode)
    }

    parseJsText() {

    }
}
