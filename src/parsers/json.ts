import { workspace } from 'vscode'
export class JsonParser {
    id = 'json'

    async load(filepath: string): Promise<object> {
        const document = await workspace.openTextDocument(filepath)
        const raw = await document.getText()
        if (!raw)
            return {}
        return await this.parse(raw)
    }

    async parse(text: string) {
        if (!text || !text.trim())
            return {}
        return JSON.parse(text)
    }
}
