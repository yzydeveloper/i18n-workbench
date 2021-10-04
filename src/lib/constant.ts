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

// 约定:所有汉字匹配均以汉字开头,所有正则针对 单行匹配
export const spaceRegexp = /\s/g
export const firstSpaceRegexp = /\s+/
export const quotationRegexp = /[\"|\']/g
export const angleBracketsRegexp = /[\<|\>]/g
export const templateBeginRegexp = /\<template/g
export const templateEndRegexp = /\<\/template/g
export const scriptBeginRegexp = /\<script/g
export const scripteEndRegexp = /\<\/script/g

// 只匹配单行注释，多行注释不考虑
export const commentRegexp = /(\/\/)|(<!--)|(\/\*)/g

// 匹配js中的汉字,配合template range 判断 是否是template中的js汉字  √ (?<!=)["'][\u4e00-\u9fa5]\S*["|']
export const scriptRegexp = /(?<!=)["'][\u4E00-\u9FA5]\S*["']/g

// 匹配属性中的汉字 √
export const propertyRegexp = /\s\S+=["'][\u4E00-\u9FA5]\S*["']/g

// 单行  匹配 template ><下，空行的汉字（retrieve） ,
export const angleBracketSpaceRegexp = /((?<=\s)[\u4E00-\u9FA5][^\s\<\>]*|(?<=[>\s])[\u4E00-\u9FA5][^\s\<\>|\n]*(?=[\s<]))/g

// 匹配到特殊字符串说明前面正则匹配有问题，给出提示，去掉匹配
export const warnRegexp = /[{}<>:]/g

// 匹配 $t替换的字符串
export const dollarTRegexp = /(?<=(\$t|i18n\.t)\(["'])[^'"]+/gm
