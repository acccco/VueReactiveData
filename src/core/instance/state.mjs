import {bind, isPlainObject, noop} from '../util/normal-util'
import {defineReactive, observe, observerState} from "../observe/index";
import {validateProp} from "../util/vue-util/props";
import Dep from "../observe/dep";
import {nativeWatch} from "../util/vue-util/env";
import Watcher from "../observe/watcher";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

// 将 target[key] 代理到 target[sourceKey][key] 下
export function proxy (target, sourceKey, key) {
    // 这里的 this 为 target
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function initState (vm) {
    vm._watchers = []
    const opts = vm.$options
    if (opts.props) initProps(vm, opts.props)
    if (opts.methods) initMethods(vm, opts.methods)
    if (opts.data) {
        initData(vm)
    } else {
        observe(vm._data = {}, true /* asRootData */)
    }
    if (opts.computed) initComputed(vm, opts.computed)
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
    }
}

function initProps (vm, propsOptions) {
    // 传入的 props 的值
    const propsData = vm.$options.propsData || {}
    // 存放 props 实际对应的值
    const props = vm._props = {}
    // 将使用到的 props 的 key 保存在 _propKeys 中，更新的时候就可以直接循环该数组
    const keys = vm.$options._propKeys = []
    const isRoot = !vm.$parent
    // 根实例的 props 需要被监听
    observerState.shouldConvert = isRoot
    for (const key in propsOptions) {
        keys.push(key)
        const value = validateProp(key, propsOptions, propsData, vm)
        defineReactive(props, key, value)
        if (!(key in vm)) {
            // this 代理 this._props 下的数据
            proxy(vm, `_props`, key)
        }
    }
    observerState.shouldConvert = true
}

function initMethods (vm, methods) {
    for (const key in methods) {
        // 将 method 下的方法挂载到 VUE 实例上，并且绑定 this 对象
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
    }
}

function initData (vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {}
    // 函数执行的结果必须是一个对象
    if (!isPlainObject(data)) {
        data = {}
    }
    // this 代理 this._data 下的数据
    const keys = Object.keys(data)
    let i = keys.length
    while (i--) {
        const key = keys[i]
        proxy(vm, `_data`, key)
    }
    // 设置 data 内容的监听
    observe(data, true /* asRootData */)
}

export function getData (data, vm) {
    try {
        return data.call(vm, vm)
    } catch (e) {
        console.log(e)
        return {}
    }
}

const computedWatcherOptions = { lazy: true }

function initComputed (vm, computed) {
    // _computedWatchers 保管生成通过计算属性的 watcher
    const watchers = vm._computedWatchers = Object.create(null)

    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get

        // 为计算属性创建对应的 Watcher
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        )

        // 定义计算属性
        if (!(key in vm)) {
            defineComputed(vm, key, userDef)
        }
    }
}

export function defineComputed (target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key)
        sharedPropertyDefinition.set = noop
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? userDef.cache !== false
                ? createComputedGetter(key)
                : userDef.get
            : noop
        sharedPropertyDefinition.set = userDef.set
            ? userDef.set
            : noop
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
    return function computedGetter () {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

function initWatch (vm, watch) {
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher (vm, keyOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        // 支持 handler 为 this 下的一个方法
        handler = vm[handler]
    }
    return vm.$watch(keyOrFn, handler, options)
}

export function stateMixin (Vue) {
    // 将 this._data 代理到 this.$data 上
    const dataDef = {}
    dataDef.get = function () { return this._data }
    const propsDef = {}
    propsDef.get = function () { return this._props }
    Object.defineProperty(Vue.prototype, '$data', dataDef)
    Object.defineProperty(Vue.prototype, '$props', propsDef)

    // 为原型链添加 $watch 方法
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        const vm = this
        if (isPlainObject(cb)) {
            // 处理 handle 传值方式
            return createWatcher(vm, expOrFn, cb, options)
        }
        options = options || {}
        // 标志该 watch 是用户添加的
        options.user = true
        const watcher = new Watcher(vm, expOrFn, cb, options)
        if (options.immediate) {
            cb.call(vm, watcher.value)
        }
        return function unwatchFn () {
            watcher.teardown()
        }
    }
}

