import * as fs from 'fs'
import * as path from 'path'
import type {
    Partial,
    DefaultConfig,
    ReadSetting,
} from './constant'
import { defaultConfig, pkgFileName, customConfigFileName } from '.'

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
