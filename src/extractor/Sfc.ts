import ExtractorAbstract, { ExtractorOptions, ExtractorResult } from './base'
import { workspace } from 'vscode'
import {
    // TemplateChildNode,
    ElementNode,
    // RootNode,
    baseParse as parse,
    //  traverseNode,
    //  createTransformContext,
    //   getBaseTransformPreset
} from '@vue/compiler-core'
// import { parse } from '@vue/compiler-sfc'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        const texts = doc.getText()
        // @vue/compiler-core
        const ast = parse(texts)
        ast.children.forEach(node => {
            if (node.type !== 1) // NODETYPES.ELEMENT
                return

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

        // @vue/compiler-sfc
        // const { descriptor } = parse(text)
        // const { template, script } = descriptor
        // console.log(template, 'template')
        // console.log(script, 'script')
        // const tagContent = template?.content.match(/(>)([^><]*[\u4E00-\u9FA5]+[^><]*)(<)/gm)
        // const tagAttr = template?.content.match(/(<[^\/\s]+)([^<>]+)(\/?>)/gm)
        // console.log(tagContent, 'tagContent')
        // console.log(tagAttr, 'tagAttr')
        console.log(options, 'options')

        return {
            id: 'vue'
        }
    }

    parseTemplateText(context: ElementNode) {
        console.log(context, 'context')
        console.log(context, 'context')
        const loop = (node: ElementNode) => {
            // 5-InterpolationNode
            // 2-TEXTNODE
            for (let i = 0; i < node.children.length; i++) {
                const _node = node.children[i] as ElementNode
                if (_node.children.length) {

                }
            }
        }
        loop(context)
        // const [nodeTransforms, directiveTransforms] = getBaseTransformPreset()
        // const context = createTransformContext(ast, {
        //     ...directiveTransforms,
        //     nodeTransforms: [
        //         ...nodeTransforms,
        //         (node) => {
        //             console.log(node, 'node')
        //         }
        //     ],
        // })
        // traverseNode(ast, context)
    }

    parseJsText() {

    }
}
