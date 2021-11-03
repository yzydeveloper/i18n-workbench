import ExtractorAbstract, { ExtractorOptions, ExtractorResult } from './base'
import { workspace } from 'vscode'
import { baseParse } from '@vue/compiler-core'
// import { parse } from '@vue/compiler-sfc'
export class SfcExtractor extends ExtractorAbstract {
    // public readonly id = 'vue'

    async extractor(options: ExtractorOptions): Promise<ExtractorResult> {
        const doc = await workspace.openTextDocument(this.uri)
        const text = doc.getText()

        // @vue/compiler-core
        const ast = baseParse(text)
        console.log(ast, 'ast')

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
}
