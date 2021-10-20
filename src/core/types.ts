import type { ExtensionContext, Disposable } from 'vscode'

export type Partial<T> = {
    [K in keyof T]?: T[K]
}

export type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

export type LocalesPath = string

export type PuidType = string

export type DirStructure = 'file' | 'dir'

export interface ExtensionModule {
    (ctx: ExtensionContext): Disposable | Disposable[]
}
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

export interface ParsedFile {
    filePath: string
    dirPath: string
    locale: string
    value: string
}
