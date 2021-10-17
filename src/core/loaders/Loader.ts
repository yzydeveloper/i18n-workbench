import { Disposable, EventEmitter } from 'vscode'
import { Log } from '~/utils'
export abstract class Loader extends Disposable {
    protected _disposables: Disposable[] = []
    protected _onDidChange = new EventEmitter<string>()
    readonly onDidChange = this._onDidChange.event

    constructor(
        public readonly name: string,
    ) {
        super(() => this.onDispose())
    }

    protected onDispose() {
        Log.info(`🗑 Disposing loader "${this.name}"`)
        this._disposables.forEach(d => d.dispose())
        this._disposables = []
    }
}
