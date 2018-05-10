import {Event} from "../util/Event.mjs";
import {observe} from "../util/Observe";
import Watcher from "../util/Watcher.mjs";
import Computed from "../util/Computed.mjs";
import {proxy} from "../util/util.mjs";
import {mergeOptions} from "../util/options.mjs";
import {getProvideForInject} from "../util/util";

let uid = 0

export class Vue extends Event {
    constructor(options) {
        super()
        this.uid = uid++
        this._init(options)
    }

    _init(options) {
        let vm = this

        vm.$options = mergeOptions(
            this.constructor.options,
            options,
            vm
        )

        let parent = vm.$options.parent
        if (parent) {
            parent.$children.push(vm)
        }
        vm.$parent = parent
        vm.$root = parent ? parent.$root : vm
        vm.$children = []

        for (let key in vm.$options.methods) {
            vm[key] = vm.$options.methods[key].bind(vm)
        }

        let data = vm._data = vm.$options.data ? vm.$options.data.call(vm) : {}
        observe(data)
        for (let key in data) {
            proxy(vm, '_data', key)
        }

        let props = vm._props = {}
        let propsData = vm.$options.propsData
        for (let key in vm.$options.props) {
            let value = propsData[key]
            if (!value) {
                value = vm.$options.props[key].default
            }
            props[key] = value
        }
        observe(props)
        for (let key in props) {
            proxy(vm, '_props', key)
        }

        for (let key in vm.$options.watch) {
            new Watcher(vm, () => {
                return key.split('.').reduce((obj, name) => obj[name], vm)
            }, (newValue, oldValue) => {
                vm.$options.watch[key].forEach(fnc => fnc(newValue, oldValue))
            })
        }

        for (let key in vm.$options.computed) {
            new Computed(vm, key, vm.$options.computed[key])
        }

        vm._provide = vm.$options.provide

        let inject = vm._inject = {}
        for (let key in  vm.$options.inject) {
            inject[key] = getProvideForInject(vm, key, vm.$options.inject[key].default)
        }
        for (let key in inject) {
            proxy(vm, '_inject', key)
        }

    }
}

Vue.options = {
    components: {},
    _base: Vue
}

Vue.extend = function (extendOptions) {
    const Super = this

    class Sub extends Super {
        constructor(options) {
            super(options)
        }
    }

    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    )

    Sub.super = Super
    Sub.extend = Super.extend

    return Sub
}

