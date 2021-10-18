import type { ConfigurationScope } from 'vscode'
import { workspace } from 'vscode'
import { EXT_NAMESPACE } from './../meta'
export default class Config {
    static extName: string

    static get extensionName() {
        return this.extName || EXT_NAMESPACE
    }

    static get localesPath(): string {
        return this.getConfig<string>('localesPath') ?? ''
    }

    static get langFile(): string[] {
        return this.getConfig<string[]>('langFile') ?? []
    }

    static get puidType(): string {
        return this.getConfig<string>('puidType') ?? ''
    }

    static get libreTranslateApiRoot(): string {
        return this.getConfig<string>('translate.libre.apiRoot') ?? ''
    }

    static get translateEngines(): string[] {
        return this.getConfig<string[]>('translate.engines') || ['google']
    }

    static get namespace(): boolean | undefined {
        return this.getConfig<boolean>('namespace')
    }

    static updateLocalesPath(path: string) {
        this.setConfig('localesPath', path)
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
