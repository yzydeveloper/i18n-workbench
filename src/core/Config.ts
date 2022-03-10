import type { ConfigurationScope, WorkspaceFolder } from 'vscode'
import { workspace, ExtensionContext } from 'vscode'
import { EXT_NAMESPACE } from './../meta'
export default class Config {
    static extName: string
    static ctx: ExtensionContext

    static get extensionName() {
        return this.extName || EXT_NAMESPACE
    }

    static get extensionPath() {
        return this.ctx.extension.extensionPath
    }

    static get localesPath(): string {
        return this.getConfig<string>('localesPath') ?? ''
    }

    static get callFunctionName(): string {
        return this.getConfig<string>('callFunctionName') ?? ''
    }

    static getLocalesPathsInScope(scope: WorkspaceFolder): string | undefined {
        return this.getConfig('localesPath', scope)
    }

    static get translateApiRoot(): string {
        return this.getConfig<string>('translate-apiRoot') ?? ''
    }

    static get translateEngines(): string[] {
        const engines = this.getConfig<string[]>('translate-engines')
        return engines && engines.length ? engines : ['google']
    }

    static get sourceLanguage(): string {
        return this.getConfig<string>('sourceLanguage') ?? 'zh-CN'
    }

    static get ignoreFiles() {
        return this.getConfig<string[]>('ignoreFiles') ?? []
    }

    static updateLocalesPath(path: string) {
        this.setConfig('localesPath', path)
    }

    static updatecallFunctionName(name: string) {
        this.setConfig('callFunctionName', name)
    }

    private static getConfig<T = any>(key: string, scope?: ConfigurationScope | undefined): T | undefined {
        let config = workspace
            .getConfiguration(this.extensionName, scope)
            .get<T>(key)

        if (config === undefined) {
            config = workspace
                .getConfiguration(this.extensionName)
                .get<T>(key)
        }

        return config
    }

    private static async setConfig(key: string, value: any, isGlobal = false) {
        if (workspace
            .getConfiguration(this.extensionName)
            .get<any>(key)
        ) {
            await workspace.getConfiguration(this.extensionName)
                .update(key, undefined, isGlobal)
        }

        // update value
        return await workspace
            .getConfiguration(this.extensionName)
            .update(key, value, isGlobal)
    }
}
