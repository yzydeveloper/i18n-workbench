import * as fs from 'fs'
import * as path from 'path'
import type {
    ReadLocalesInfo,
    VarifyFile,
    ReturnReadLocalesInfo,
} from './constant'
import { Messages } from './message'
import { pkgFileName, readSetting } from '.'

/**
 * JSON检测
 * @param obj
 * @returns
 */
export function isJSON(obj: object) {
    return obj.constructor === Object
}

/**
 * 修改本地国际化文件
 * @param param0
 * @returns
 */
const varifyFile = (params: VarifyFile): ReturnReadLocalesInfo[] => {
    const { fsPath, showError, showInfo } = params
    const result = fsPath.map(path => {
        let exist = false
        if (!fs.existsSync(path)) {
            showError && Messages.showActionableMessage('error', `Not Found File:${path}`, false)
        }
        else {
            showInfo && Messages.showActionableMessage('info', `Get Locales Path:${path}`)
            exist = true
        }
        return { localesPath: path, exist }
    })
    return result
}

/**
 * 获取本地国际化
 * @param params
 * @returns
 */
export function readLocalesInfo(params: ReadLocalesInfo): ReturnReadLocalesInfo[] | string {
    const { fsPath, defaultLocalesPath, isGetRootPath = false, showInfo = false, showError = true } = params
    const dirName = path.dirname(fsPath)
    if (fs.existsSync(path.join(dirName, pkgFileName))) {
        if (isGetRootPath) return dirName
        const lang = readSetting({
            fsPath: path.join(dirName, pkgFileName),
            key: 'langFile'
        }) as string[]
        const localesPath = readSetting({
            fsPath: path.join(dirName, pkgFileName),
            key: 'defaultLocalesPath',
        }) as string

        const jsonPath = lang.map(item => {
            if (defaultLocalesPath) return path.join(dirName, defaultLocalesPath, item)
            return path.join(dirName, localesPath || '', item)
        })

        return varifyFile({
            showInfo,
            showError,
            fsPath: jsonPath
        })
    }
    else {
        const temp: ReadLocalesInfo = {
            fsPath: dirName,
            isGetRootPath,
            defaultLocalesPath,
            showInfo,
            showError,
        }
        return readLocalesInfo(temp)
    }
}
