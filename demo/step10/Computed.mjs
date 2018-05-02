import Watcher from '../util/Watcher'

function noop() {
}

let uid = 0

export default class Computed {
    constructor(key, option, ctx) {
        this.uid = ++uid
        this.key = key
        this.option = option
        this.ctx = ctx
        this._init()
    }

    _init() {
        let watcher = new Watcher(
            this.ctx,
            this.option.get || noop,
            noop,
            {lazy: true}
        )

        Object.defineProperty(this.ctx, this.key, {
            enumerable: true,
            configurable: true,
            set: this.option.set || noop,
            get() {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                return watcher.value
            }
        })
    }
}