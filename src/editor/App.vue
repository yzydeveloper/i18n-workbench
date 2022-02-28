<template>
    <div id="workbench">
        <div class="workbench-content">
            <div class="workbench-content-header">
                <div class="button save-button"
                     @click="save">
                    保存到文件
                </div>
            </div>
            <div v-for="(item,index) in pendingWrite"
                 :key="index"
                 class="workbench-content-editor">
                <div class="editor-header"></div>
                <div class="editor-title">
                    <span>Key：</span>
                    <input class="input"
                           v-model="item.key">
                    <div class="button-group">
                        <div class="button"
                             @click="translate(item,index)">翻译</div>
                    </div>
                </div>
                <div class="editor-core"
                     v-for="(locale,index) in allLocales"
                     :key="index">
                    <div class="editor-core-translate">{{ locale }}</div>
                    <div class="editor-core-content">
                        <input class="input"
                               v-model="item.languages[locale]">
                    </div>
                    <div class="editor-core-path"
                         v-if="dirStructure==='dir'">
                        <select class="select"
                                :title="item.insertPath[locale]"
                                v-model="item.insertPath[locale]">
                            <option class="option"
                                    :value="path"
                                    v-for="path in languageMapFile[locale]"
                                    :key="path">
                                {{ path }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import type { PendingWrite } from './../core'
import { EventTypes } from './events'
import { vscode, useWorkbenchStore } from './useWorkbenchStore'
export default {
    setup() {
        const {
            dirStructure,
            allLocales,
            languageMapFile,
            sourceLanguage,
            pendingWrite,
        } = useWorkbenchStore()

        function save() {
            vscode.postMessage({
                type: EventTypes.SAVE,
                data: JSON.stringify(pendingWrite.value),
            })
        }

        function translate(item: PendingWrite, index: number) {
            const text = item.languages[sourceLanguage.value as string]
            vscode.postMessage({
                type: EventTypes.TRANSLATE_SINGLE,
                data: {
                    index,
                    text,
                },
            })
        }
        return {
            dirStructure,
            allLocales,
            languageMapFile,
            sourceLanguage,
            pendingWrite,
            save,
            translate,
        }
    },
}
</script>
 <style>
.select {
    width: 120px;
    cursor: pointer;
    background: var(--vscode-input-background);
    padding: unset;
    border: none;
    color: var(--vscode-forground);
    font-size: var(--vscode-font-size);
}

.select:focus {
    outline: none;
    box-shadow: none;
}
.option {
    background: var(--vscode-inputOption-activeBackground);
}

.button-group {
    display: flex;
    align-items: center;
    margin-left: 8px;
}

.button {
    cursor: pointer;
    position: relative;
    padding: 0.4em 0.8em;
    font-size: 0.8em;
    display: inline-block;
}

.button:hover:before {
    opacity: 0.3;
}

.button:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 3px;
    z-index: -1;
    pointer-events: none;
    background: var(--vscode-foreground);
    opacity: 0.1;
}

.input {
    background: transparent;
    padding: unset;
    border: none;
    color: var(--vscode-forground);
    width: 100%;
    font-size: var(--vscode-font-size);
}

.input:focus {
    outline: none;
    box-shadow: none;
}

.save-button {
    margin-top: 16px;
    padding: 1.4em 1.8em;
    font-size: 0.9em;
}

.workbench-content-editor {
    margin-top: 16px;
    padding: 8px 16px;
    user-select: none;
    position: relative;
}

.workbench-content-editor:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    z-index: -1;
    pointer-events: none;
    background-color: var(--vscode-foreground);
    opacity: 0.07;
}

/* 编辑器标题 */
.editor-title {
    display: flex;
    align-items: center;
}

.editor-title span {
    width: 50px;
    display: inline-block;
    font-size: 12px;
}

.editor-title .input {
    flex: 1;
}

/* 编辑器 */
.editor-core {
    display: flex;
    min-height: 30px;
    margin-top: 8px;
    font-size: var(--vscode-font-size);
    font-family: var(--vscode-editor-font-family);
}

.editor-core-translate {
    width: 50px;
    display: flex;
    align-items: center;
    text-align: center;
}

.editor-core-content {
    display: flex;
    align-items: center;
    flex: 1;
}

.editor-core-path {
    display: flex;
    align-items: center;
}
</style>
