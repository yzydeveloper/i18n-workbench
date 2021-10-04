import * as fs from 'fs'
import * as path from 'path'
import type {
    Partial,
    DefaultConfig,
    ReadLocalesInfo,
    VarifyFile,
    ReadSetting,
    ReturnReadLocalesInfo,
} from './constant'
import { Messages } from './message'
import { pkgFileName, customConfigFileName } from './constant'
import { defaultConfig } from './constant'

/**
 * JSON检测
 * @param obj
 * @returns
 */
export function isJSON(obj: Object) {
    return obj.constructor === Object
}

/**
 *
 * @param customSetting 自定义配置
 * @param key key
 * @returns
 */
export function getSettingValue<T extends DefaultConfig, K extends keyof T>(customSetting: T, key: K) {
    return customSetting && Object.prototype.hasOwnProperty.call(customSetting, key)
        ? customSetting[key]
        : defaultConfig[key as keyof typeof defaultConfig]
}

/**
 * 读取配置
 * @param params
 * @returns
 */
export function readSetting<T extends DefaultConfig, K extends keyof T>(params: ReadSetting): K | Partial<T> {
    const { fsPath, key, specific = true, ignoreCustom = false } = params
    const dirName = path.dirname(fsPath)
    if (fs.existsSync(path.join(dirName, pkgFileName))) {
        const customPath = path.join(dirName, customConfigFileName)
        const data = fs.existsSync(customPath) && !ignoreCustom ? fs.readFileSync(customPath) : ''
        const customSettings = data?.toString() ? JSON.parse(data.toString()) : {}
        // TODO 错误校验
        // if (
        //     fs.existsSync(customPath)
        //     && !ignoreCustom
        // ) {
        //     Messages.showActionableMessage(
        //         'error',
        //         `'${customPath}' is not a right json, custom setting will not work`
        //     )
        // }
        if (typeof key === 'string')
            return getSettingValue(customSettings, key)

        if (Array.isArray(key)) {
            return key.reduce((settings, current) => {
                settings[current] = getSettingValue(customSettings, current)
                return settings
            }, Object.create(null))
        }
        return Object.create(null)
    }
    else {
        const temp: ReadSetting = {
            fsPath: dirName,
            key,
            specific,
            ignoreCustom
        }
        return readSetting(temp)
    }
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
