import { readFileSync } from 'fs'

export class JsonParser {
    id = 'json'

    async load(filepath: string): Promise<object> {
        const raw = await readFileSync(filepath, 'utf-8')
        if (!raw) { return {} }
        return await this.parse(raw)
    }

    async parse(text: string) {
        if (!text || !text.trim()) { return {} }
        return JSON.parse(text)
    }
}
