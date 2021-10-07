export type Partial<T> = {
    [K in keyof T]?: T[K]
}

export type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

export type LocalesPath = string

export type PuidType = string

export interface DefaultConfig {
    localesPath: LocalesPath
    langFile: string[]
    hover: boolean
    puidType: string
}

export interface ReadSetting {
    fsPath: string
    key: string[] | string
    specific?: boolean
    ignoreCustom?: boolean
}

export interface ReadLocalesInfo {
    fsPath: string
    defaultLocalesPath: string
    isGetRootPath?: boolean
    showInfo?: boolean
    showError?: boolean
}
export interface VarifyFile {
    fsPath: string[]
    showInfo?: boolean
    showError?: boolean
}
export interface ReturnReadLocalesInfo {
    localesPath: LocalesPath
    exist: boolean
}

export const defaultConfig = {
    localesPath: 'src/locales',
    langFile: ['zh-CN.json', 'en-US.json'],
    hover: true,
    puidType: 'short',
}

export const pkgFileName = 'package.json'

export const customConfigFileName = 'i18n.json'
