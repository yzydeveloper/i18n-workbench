import type { TranslateOptions } from './engines/base'
import TranslateEngine from './engines/base'
import GoogleTranslateEngine from './engines/google'
import GoogleTranslateCnEngine from './engines/google-cn'
import LibreTranslateEngine from './engines/libretranslate'

export class Translator {
    engines: Record<string, TranslateEngine> = {
        google: new GoogleTranslateEngine(),
        'google-cn': new GoogleTranslateCnEngine(),
        libretranslate: new LibreTranslateEngine(),
    }

    async translate(options: TranslateOptions & { engine: string }) {
        const engine = this.engines[options.engine]
        return await engine.translate(options)
    }
}

export {
    TranslateEngine,
    GoogleTranslateEngine,
    GoogleTranslateCnEngine,
    LibreTranslateEngine,
}

export * from './engines/base'
