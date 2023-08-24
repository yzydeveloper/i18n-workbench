import { Uri, Webview } from 'vscode'
import { join } from 'path'
import { readFileSync } from 'fs'

export function getHtmlForWebview(
    webview: Webview,
    extensionUri: Uri,
    entryPath: string
): string {
    const extensionPath = extensionUri.fsPath
    const entry = join(extensionPath, entryPath)
    const html = readFileSync(entry, 'utf-8')
    const fileContent = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (_, pre, suf) => {
        // const path = webview.asWebviewUri(Uri.file(join(dirname(entry), suf))) // Create an URI from a file system path
        const path = webview.asWebviewUri(Uri.joinPath(extensionUri, 'resources', 'workbench', suf)) //  Create a new uri
        return `${pre}${path}"`
    })

    return fileContent
}
