import type { ExtensionContext, Disposable } from 'vscode'

export type Partial<T> = {
    [K in keyof T]?: T[K]
}

export type Readonly<T> = {
    readonly [P in keyof T]: T[P]
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
    insertPath: string
    value: object
}
