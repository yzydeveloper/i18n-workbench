import axios from 'axios'
import type { TranslateResult, TranslateOptions } from './base'
import TranslateEngine from './base'

export default class GoogleTranslate extends TranslateEngine {
    link = 'https://translate.google.com'
    apiRoot = 'https://translate.googleapis.com'

    async translate(options: TranslateOptions) {
        const {
            from = 'auto',
            to = 'auto',
        } = options

        const { data } = await axios({
            method: 'GET',
            url: `${this.apiRoot}/translate_a/single?client=gtx&sl=${from}&tl=${to}&hl=zh-CN&dt=t&dt=bd&ie=UTF-8&oe=UTF-8&dj=1&source=icon&q=${encodeURI(options.text)}`,
        })

        return this.transform(data, options)
    }

    transform(response: any, options: TranslateOptions): TranslateResult {
        const {
            text,
            to = 'auto',
        } = options

        const r: TranslateResult = {
            text,
            to,
            from: response.src,
            response,
            linkToResult: `${this.link}/#auto/${to}/${text}`,
        }

        // 尝试获取详细释义
        try {
            const detailed: string[] = []
            response.dict.forEach((v: any) => {
                detailed.push(`${v.pos}：${(v.terms.slice(0, 3) || []).join(',')}`)
            })
            r.detailed = detailed
        }
        catch (e) { }

        // 尝试取得翻译结果
        try {
            const result: string[] = []
            response.sentences.forEach((v: any) => {
                result.push(v.trans)
            })
            r.result = result
        }
        catch (e) { }

        if (!r.detailed && !r.result)
            r.error = new Error('No result')

        return r
    }
}
