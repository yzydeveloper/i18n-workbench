import type { Uri } from 'vscode'
import { Loader } from './Loader'
export class DocLoader extends Loader {
    constructor(
        private readonly uri: Uri
    ) {
        super(`[DOC]${uri.fsPath}`)
    }

    get filePath() {
        return this.uri.fsPath
    }

    load() {

    }
}
