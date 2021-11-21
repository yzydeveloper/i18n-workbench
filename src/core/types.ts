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
    filePath: string
    dirPath: string
    locale: string
    value: string
}

export interface PendingData {
    key: string
    insertPath: string | Dictionary<string> // 写入的文件，对应语言环境或者语言类型
    value: Dictionary<object>
}

export interface UsableData {
    rootKeys: string[]
    unFlattenData: Dictionary<object>
    flattenData: object
}
