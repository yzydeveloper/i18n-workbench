import type { MessageItem } from 'vscode'
import { window } from 'vscode'

export enum SuppressedMessages { }
export class Messages {
    static showActionableMessage(
        type: 'info' | 'warn' | 'error',
        message: string,
        needOpen: boolean,
        callback?: { name: string; func: Function }
    ): Promise<MessageItem | undefined> {
        const actions = [
            { title: 'Got it' },
            { title: needOpen ? 'View it' : '' },
            { title: callback && callback.name || '' }
        ].filter(v => !!v.title)

        return Messages.showMessage(type, message, undefined, ...actions)
    }

    private static async showMessage(
        type: 'info' | 'warn' | 'error',
        message: string,
        suppressionKey?: SuppressedMessages,
        ...actions: MessageItem[]
    ): Promise<MessageItem | undefined> {
        let result: MessageItem | undefined
        switch (type) {
            case 'info':
                result = await window.showInformationMessage(message, ...actions)
                break

            case 'warn':
                result = await window.showWarningMessage(message, ...actions)
                break

            case 'error':
                result = await window.showErrorMessage(message, ...actions)
                break
        }

        return result
    }
}
