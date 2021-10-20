import { JsonParser } from './json'
import { EcmascriptParser } from './ecmascript'

export const DefaultEnabledParsers = ['json', 'yaml', 'json5']

export const AvailableParsers = [
    new JsonParser(),
    new EcmascriptParser('js'),
    new EcmascriptParser('ts'),
]
