import type { ExtensionContext, Disposable, Range } from 'vscode'

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
    group: string
    filepath: string
    dirPath: string
    unflattenValue: object
    flattenValue: object
}

export interface PendingWrite {
    key: string
    insertPath: string | Dictionary<string> // 写入的文件，对应语言环境或者语言类型
    languages: Dictionary<string>
}

export interface PendingWriteParsed {
    rootKeys: string[]
    unFlattenData: object
    flattenData: Dictionary<string>
}

export interface RefactorTextResult {
    replaceTo: string
    start: number
    end: number
    range: Range
}
