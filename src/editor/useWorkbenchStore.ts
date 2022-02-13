import type { DirStructure, PayloadType } from './../core'
import { ComputedRef } from 'vue'
import { reactive, toRefs, computed } from 'vue'
import { EventTypes } from './events'
interface WorkbenchStore {
    config: {
        allLocales: string[]
        dirStructure: DirStructure
        sourceLanguage: string
        languageMapFile: Record<string, string[]>
        payload: PayloadType[]
    }
    allLocales: Partial<ComputedRef<string[]>>
    dirStructure: Partial<ComputedRef<DirStructure>>
    sourceLanguage: Partial<ComputedRef<string>>
    languageMapFile: Partial<ComputedRef<Record<string, string[]>>>
    payload: Partial<ComputedRef<PayloadType[]>>
}

export const vscode = window.acquireVsCodeApi()

export const store: WorkbenchStore = reactive<WorkbenchStore>({
    config: {
        allLocales: [],
        dirStructure: '',
        sourceLanguage: '',
        languageMapFile: {},
        payload: []
    },
    allLocales: computed(() => store.config.allLocales),
    sourceLanguage: computed(() => store.config.sourceLanguage),
    dirStructure: computed(() => store.config.dirStructure),
    languageMapFile: computed(() => store.config.languageMapFile),
    payload: computed(() => store.config.payload),
})

export function useWorkbenchStore() {
    function effectView(message: any) {
        const { value, index } = message.data
        store.config.payload[index].languages = value
    }
    vscode.postMessage({ type: EventTypes.READY })
    window.addEventListener('message', (event) => {
        const message = event.data
        switch (message.type) {
            case EventTypes.CONFIG:
                store.config = message.data
                break
            case EventTypes.TRANSLATE_SINGLE:
                effectView(message)
                break
            default:
                break
        }
    })
    return {
        ...toRefs(store)
    }
}
