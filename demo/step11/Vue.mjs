import {Event} from "../util/Event.mjs";
import {observe} from "../util/Observe";
import Watcher from "../util/Watcher.mjs";
import Computed from "./Computed.mjs";
import {proxy} from "../util/util.mjs";

let uid = 0

export class Vue extends Event {
    constructor(options) {
        super()
        this.uid = uid++
        this._init(options)
    }

    _init(options) {
        let vm = this

        for (let key in options.methods) {
            vm[key] = options.methods[key].bind(vm)
        }

        vm._data = options.data.call(vm)
        observe(vm._data)
        for (let key in vm._data) {
            proxy(vm, '_data', key)
        }

        for (let key in options.watch) {
            new Watcher(vm, () => {
                return key.split('.').reduce((obj, name) => obj[name], vm)
            }, options.watch[key])
        }

        for (let key in options.computed) {
            new Computed(vm, key, options.computed[key])
        }

    }
}

Vue.extend = function (extendOptions) {
    const Super = this
    class Sub extends Super {
        constructor(options) {
            super(extendOptions)
        }
    }

    Sub.super = Super
    Sub.extend = Super.extend
}

