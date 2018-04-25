import {Event} from "../util/Event.mjs";
import {observe} from "../util/Observe";
import Watcher from "../util/Watcher.mjs";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get() {
    },
    set() {
    }
}

export function proxy(target, sourceKey, key) {
    // 这里的 this 为 target
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

let uid = 0

export class Vue extends Event {
    constructor(options) {
        super()
        this._init(options)
    }

    _init(options) {
        let vm = this
        vm.uid = uid++
        vm.$options = options
        vm._watchers = []

        if (options.methods) {
            for (let key in options.methods) {
                vm[key] = options.methods[key].bind(vm)
            }
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

    }
}

