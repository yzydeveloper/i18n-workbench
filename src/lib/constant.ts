export type Partial<T> = {
    [K in keyof T]?: T[K]
}

export type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

export type LocalesPath = string

export interface DefaultConfig {
    localesPath: LocalesPath
    langFile: string[]
    hover: Boolean
    puidType: string
}

export interface ReadSetting {
    fsPath: string
    key: Array<string> | string
    specific?: Boolean
    ignoreCustom?: Boolean
}

export interface ReadLocalesInfo {
    fsPath: string
    defaultLocalesPath: string
    isGetRootPath?: Boolean
    showInfo?: Boolean
    showError?: Boolean
}
export interface VarifyFile {
    fsPath: string[]
    showInfo?: Boolean
    showError?: Boolean
}
export interface ReturnReadLocalesInfo {
    localesPath: LocalesPath
    exist: Boolean
}

export const defaultConfig = {
    localesPath: 'src/locales',
    langFile: ['zh-CN.json', 'en-US.json'],
    hover: true,
    puidType: 'short',
}

export const pkgFileName = 'package.json'

export const customConfigFileName = 'i18n.json'
