import type { WebviewPanel } from 'vscode'
import type { PendingData, UsableData, Dictionary } from './types'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { window, ViewColumn, Uri, Disposable, workspace } from 'vscode'
import { findLanguage } from './../utils'
import { unflatten } from 'flat'
import { Global, CurrentFile } from '.'
import { isObjectProperty, isIdentifier, isExportDefaultDeclaration } from '@babel/types'
import { parse, parseExpression } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import Config from './Config'

export interface Message {
    type: string | number
    data?: any
}
enum EventTypes {
    READY,
    CONFIG,
    UPDATE_SINGLE,
    SAVE
}
export class Workbench {
    public static workbench: Workbench | undefined
    private readonly panel: WebviewPanel
    private disposables: Disposable[] = []

    private get config() {
        const { loader } = Global
        const { allLocales, localeFileLanguage, dirStructure } = loader
        const { pending } = CurrentFile
        return {
            allLocales,
            sourceLanguage: findLanguage(Config.sourceLanguage),
            dirStructure,
            localeFileLanguage,
            pending
        }
    }

    private handleMessages(message: Message) {
        const { type, data } = message
        switch (type) {
            case EventTypes.READY:
                this.panel.webview.postMessage({
                    type: EventTypes.CONFIG,
                    data: this.config
                })

                break
            case EventTypes.SAVE:
                this.saveToFile(data)
                break
            case EventTypes.UPDATE_SINGLE:
                this.translateSignal(data)
                break
        }
    }

    private constructor() {
        this.panel = window.createWebviewPanel(
            'workbench',
            '工作台',
            ViewColumn.Beside,
            { enableScripts: true }
        )

        this.panel.iconPath = Uri.file(
            join(Config.extensionPath, 'resources/workbench.svg')
        )

        this.panel.webview.html = readFileSync(
            join(Config.extensionPath, 'resources/workbench.html'),
            'utf-8',
        )

        this.panel.webview.onDidReceiveMessage((message) => this.handleMessages(message), null, this.disposables)

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables)
    }

    static createWorkbench() {
        if (!Workbench.workbench)
            Workbench.workbench = new Workbench()
        return Workbench.workbench
    }

    // 保存到文件
    public async saveToFile(data: Message['data']) {
        const pendingData: PendingData[] = JSON.parse(data)
        const usableData = this.handlePendingData(pendingData)
        console.log(usableData, 'usableData')
        return
        const mock = `{
            filesView: {
                IN_WARNING: '告警中',
                SHIELDED: '已屏蔽',
                LIFTED: '已解除',
            },
            test:"测试"
        }`
        const { files, localeFileLanguage } = Global.loader
        console.log(files, 'loader')
        const filePath = files[2]
        console.log(localeFileLanguage['zh-cn'][filePath], 'data')
        const document = await workspace.openTextDocument(filePath)
        const texts = await document.getText()
        const sourceAst = parse(texts, {
            sourceType: 'module'
        })
        console.log(sourceAst, 'sourceAst')
        const tempKey = ['warningStates']
        traverse(sourceAst, {
            Program: {
                enter(path) {
                    path.traverse({
                        ObjectExpression(p) {
                            if (isExportDefaultDeclaration(p.parent)) {
                                const { properties } = p.node
                                properties.forEach(propertie => {
                                    if (isObjectProperty(propertie)) {
                                        if (isIdentifier(propertie.key)) {
                                            const key = propertie.key.name
                                            if (tempKey.includes(key))
                                                propertie.value = parseExpression(mock)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
        const { code } = generate(sourceAst, {
            retainLines: false,
            compact: 'auto',
            concise: false,
            jsescOption: {
                quotes: 'single',
                minimal: true
            }
        }, texts)
        writeFileSync(filePath, code)
        console.log(parseExpression(mock), 'mock')
    }

    // 更新单条
    public async translateSignal(data: Message['data']) {
        const { text, index } = data
        const r = await CurrentFile.translateSingle(text)
        this.panel.webview.postMessage({
            type: EventTypes.UPDATE_SINGLE,
            data: {
                index,
                value: r
            }
        })
    }

    // 处理等待数据
    public handlePendingData(data: PendingData[]) {
        const usableData = data.reduce((result, item) => {
            const { key, insertPath, value: language } = item
            const rootKey = key.split('.')[0]
            if (key && rootKey) {
                Object.keys(item.insertPath).forEach(locale => {
                    if (typeof insertPath === 'object') {
                        if (!result[insertPath[locale]]) {
                            result[insertPath[locale]] = {
                                rootKeys: [],
                                unFlattenData: {},
                                flattenData: {}
                            }
                        }
                        result[insertPath[locale]].rootKeys.push(rootKey)
                        result[insertPath[locale]].flattenData[key] = language[locale]
                        result[insertPath[locale]].unFlattenData = unflatten(result[insertPath[locale]].flattenData)
                    }
                })
            }
            return result
        }, {} as Dictionary<UsableData>)
        return usableData
    }

    public dispose() {
        Workbench.workbench = undefined

        Disposable.from(...this.disposables).dispose()

        this.panel.dispose()
    }
}
