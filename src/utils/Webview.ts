import { Uri } from 'vscode'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

function originResourceProcess(url: string) {
    return Uri.file(url).with({ scheme: 'vscode-resource' })
}
export function getHtmlForWebview(
    extensionPath: string,
    entryPath: string
): string {
    const entry = join(extensionPath, entryPath)
    const html = readFileSync(entry, 'utf-8')
    const fileContent = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (_, pre, suf) => {
        const path = originResourceProcess(join(dirname(entry), suf))
        return `${pre}${path}"`
    })
    return fileContent
}
