import type { ExtensionContext, Disposable } from 'vscode'

export type Partial<T> = {
    [K in keyof T]?: T[K]
}

export type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

export type Dictionary<T> = {
    [key: string]: T
}

export type LocalesPath = string

export type DirStructure = 'file' | 'dir' | ''

export interface ExtensionModule {
    (ctx: ExtensionContext): Disposable | Disposable[]
}

export interface ParsedFile {
    originLocale: string
    locale: string
    filePath: string
    dirPath: string
    unflattenValue: string
    flattenValue: unknown
}

export interface PendingData {
    key: string
    insertPath: string | Dictionary<string> // 写入的文件，对应语言环境或者语言类型
    languages: Dictionary<string>
}

export interface UsableData {
    rootKeys: string[]
    unFlattenData: object
    flattenData: Dictionary<string>
}
