import type { TranslateResult } from './../translators'
import { Translator as TranslatorEngine } from './../translators'
import { Log } from './../utils'
import Config from './Config'

export class Translator {
    private static _translator = new TranslatorEngine()

    private static async translateText(text: string, from: string, to: string) {
        const engines = Config.translateEngines
        let trans_result: TranslateResult | undefined

        const errors: unknown[] = []

        if (!text) {
            return ''
        }

        for (const engine of engines) {
            try {
                // eslint-disable-next-line no-await-in-loop
                trans_result = await this._translator.translate({ engine, text, from, to })
                if (trans_result.error) { throw trans_result.error }

                break
            } catch (e) {
                errors.push(e)
            }
        }

        const result = trans_result && (trans_result.result || []).join('\n')

        if (!result) { throw errors[0] }

        return result
    }

    static translate(from: string, text: string, langs: string[]) {
        const { sourceLanguage } = Config

        const tasks = langs.map(lang => {
            if (sourceLanguage === lang) { return Promise.resolve({ lang, text }) }

            return this.translateText(text, from, lang).then((result) => ({
                lang,
                text: result
            })).catch(() => {
                Log.warn('NetWork Error')

                return {
                    lang,
                    text: ''
                }
            })
        })

        return Promise.all(tasks).then(data =>
            data.reduce<Record<string, string>>((_, item) => {
                _[item.lang] = item.text
                return _
            }, {}))
    }
}
