import Watcher from '../util/Watcher.mjs'

function noop() {
}

export default class Computed {
    constructor(key, option, ctx) {
        this.key = key
        this.ctx = ctx
        this.option = option
        this._init()
    }

    _init() {
        let computedWatchers = this.ctx._computedWatchers

        let watcher = computedWatchers[this.key] = new Watcher(
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