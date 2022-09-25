/**
 * https://github.com/lokalise/i18n-ally/blob/main/src/extraction/rules/index.ts
 */
import { ExtractionScore, ExtractionRule } from './base'
import { BasicExtrationRule } from './basic'
import { NonAsciiExtractionRule } from './non-ascii-characters'
import { QUOTES_CHARACTER, TEMPLATE_INNER_SYMBOL, CLOSED_TAG } from '../../meta'

export * from './base'
export * from './basic'
export * from './non-ascii-characters'

export const DefaultExtractionRules = [
    new BasicExtrationRule(),
    new NonAsciiExtractionRule()
]

export function shouldExtract(str: string, rules: ExtractionRule[] = DefaultExtractionRules): boolean {
    let extract = false

    for (const rule of rules) {
        const result = rule.shouldExtract(str)
        if (result === ExtractionScore.MustExclude) { return false }
        if (result === ExtractionScore.MustInclude) { return true }
        if (result === ExtractionScore.ShouldExclude) { extract = false }
        if (result === ExtractionScore.ShouldInclude) { extract = true }
    }
    return extract
}

export function extractFromText(content: string): string[] {
    const quotesInner = content.match(QUOTES_CHARACTER) || [] // 引号内的
    const forcedToMatch = content
        .replace(/`/g, '\n') // 将 ` 替换为 \n
        .replace(CLOSED_TAG, '\n') // 将 <> </> 替换为 \n
        .replace(QUOTES_CHARACTER, '') // 将 "" '' 清除
        .replace(TEMPLATE_INNER_SYMBOL, '\n') // 将 ${} 替换为 \n
        .split(/\n/g)
        .map(i => i.trim())
        .filter(Boolean) // 根据 \n 分割 去空 过滤

    const merge = [...quotesInner, ...forcedToMatch].reduce<string[]>((result, text) => {
        if (shouldExtract(text)) { result.push(text) }

        return result
    }, [])

    return merge
}

export function extractFromPlainText(content: string): string[] {
    return content.split(/\n/g).map(i => i.trim()).filter(Boolean)
}
