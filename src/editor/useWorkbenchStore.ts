import type { DirStructure } from './../core'
import type { ComputedRef } from 'vue'
import { reactive, computed } from 'vue'
import { EventTypes } from './events'
const vscode = window.acquireVsCodeApi()

interface WorkbenchStore {
    config: {
        allLocales: string[]
        sourceLanguage: string
        dirStructure: DirStructure
    }
    allLocales: Partial<ComputedRef<string[]>>
    sourceLanguage: Partial<ComputedRef<string>>
    dirStructure: Partial<ComputedRef<DirStructure>>
}

export const store: WorkbenchStore = reactive<WorkbenchStore>({
    config: {
        allLocales: [],
        sourceLanguage: '',
        dirStructure: ''
    },
    allLocales: computed(() => store.config.allLocales),
    sourceLanguage: computed(() => store.config.sourceLanguage),
    dirStructure: computed(() => store.config.dirStructure),
})

export function useWorkbenchStore() {
    vscode.postMessage({ type: EventTypes.READY })
    window.addEventListener('message', (event) => {
        const message = event.data
        switch (message.type) {
            case EventTypes.CONFIG:
                store.config = message.data
                break
            case EventTypes.TRANSLATE_SINGLE:

                break
            default:
                break
        }
    })
}
