import type { ExtensionContext, WorkspaceFolder } from 'vscode'
import { workspace, window } from 'vscode'
import { ConfigLocalesGuide } from '~/commands/configLocalePaths'
import { LocaleLoader } from './loaders/LocaleLoader'
import { Log } from '~/utils'
import Config from './Config'
export class Global {
    private static _loaders: Record<string, LocaleLoader> = {}
    private static _rootPath: string
    private static _currentWorkspaceFolder: WorkspaceFolder

    static context: ExtensionContext

    static async init(context: ExtensionContext) {
        this.context = context

        context.subscriptions.push(workspace.onDidChangeWorkspaceFolders(() => this.updateRootPath()))
        context.subscriptions.push(window.onDidChangeActiveTextEditor(() => this.updateRootPath()))
        context.subscriptions.push(workspace.onDidOpenTextDocument(() => this.updateRootPath()))
        context.subscriptions.push(workspace.onDidCloseTextDocument(() => this.updateRootPath()))
        context.subscriptions.push(workspace.onDidChangeConfiguration(() => this.update()))
        await this.updateRootPath()
    }

    static get rootPath() {
        return this._rootPath
    }

    static get localesPath(): string {
        return Config.localesPath
    }

    static async update() {
        const hasLocalesSet = !!Global.localesPath

        if (!hasLocalesSet) {
            ConfigLocalesGuide.autoSet()
            this.unloadAll()
        }
        else {
            await this.initLoader(this._rootPath)
        }
    }

    private static unloadAll() {
        Object.values(this._loaders).forEach(loader => loader.dispose())
        this._loaders = {}
    }

    private static async initLoader(rootPath: string, reload = false) {
        if (!rootPath)
            return

        if (this._loaders[rootPath] && !reload)
            return this._loaders[rootPath]

        const loader = new LocaleLoader(rootPath)
        await loader.init()
        this.context.subscriptions.push(loader)
        this._loaders[rootPath] = loader

        return this._loaders[rootPath]
    }

    private static async updateRootPath() {
        const editor = window.activeTextEditor
        let rootPath = ''

        if (!editor || !workspace.workspaceFolders || workspace.workspaceFolders.length === 0)
            return

        const resource = editor.document.uri
        if (resource.scheme === 'file') {
            const folder = workspace.getWorkspaceFolder(resource)
            if (folder) {
                this._currentWorkspaceFolder = folder
                console.log(this._currentWorkspaceFolder, '_currentWorkspaceFolder')

                rootPath = folder.uri.fsPath
            }
        }

        if (!rootPath && workspace.workspaceFolders[0].uri.fsPath)
            rootPath = workspace.workspaceFolders[0].uri.fsPath

        if (rootPath && rootPath !== this._rootPath) {
            this._rootPath = rootPath

            Log.divider()
            Log.info(`💼 Workspace root changed to "${rootPath}"`)

            await this.update()
        }
    }

    static getPathMatcher() {
        if (Config.namespace) {
            return {
                matcher: '{locale}/{namespaces}.{ext}',
                regex: /^(?<locale>[\w-_]+)\/(?<namespace>.+)\.(?<ext>)$/
            }
        }
        return {
            matcher: '{locale}.{ext}',
            regex: /^(?<locale>[\w-_]+)\.(?<ext>)$/
        }
    }
}
