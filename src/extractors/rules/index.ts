/**
 * https://github.com/lokalise/i18n-ally/blob/main/src/extraction/rules/index.ts
 */
import { ExtractionScore, ExtractionRule } from './base'
import { BasicExtrationRule } from './basic'
import { NonAsciiExtractionRule } from './non-ascii-characters'

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
        if (result === ExtractionScore.MustExclude)
            return false
        if (result === ExtractionScore.MustInclude)
            return true
        if (result === ExtractionScore.ShouldExclude)
            extract = false
        if (result === ExtractionScore.ShouldInclude)
            extract = true
    }
    return extract
}
