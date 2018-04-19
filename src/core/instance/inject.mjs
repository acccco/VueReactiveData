import {hasSymbol} from "../../util/vue-util/env";
import {defineReactive, observerState} from "../observe/index";

export function initInjections(vm) {
    // 获取到所有的 inject 对应的值
    const result = resolveInject(vm.$options.inject, vm)
    if (result) {
        observerState.shouldConvert = false
        Object.keys(result).forEach(key => {
            // 将属性代理到 this 下，并使得 inject 的值为可监听
            defineReactive(vm, key, result[key])
        })
        observerState.shouldConvert = true
    }
}

// 用于获取所有的 inject 对应的 _provided 的值
export function resolveInject(inject, vm) {
    if (inject) {
        const result = Object.create(null)
        // 获取到所有可遍历属性
        const keys = hasSymbol
            ? Reflect.ownKeys(inject).filter(key => {
                return Object.getOwnPropertyDescriptor(inject, key).enumerable
            })
            : Object.keys(inject)

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const provideKey = inject[key].from
            let source = vm
            while (source) {
                if (source._provided && provideKey in source._provided) {
                    result[key] = source._provided[provideKey]
                    break
                }
                source = source.$parent
            }
            if (!source) {
                if ('default' in inject[key]) {
                    const provideDefault = inject[key].default
                    result[key] = typeof provideDefault === 'function'
                        ? provideDefault.call(vm)
                        : provideDefault
                }
            }
        }
        return result
    }
}

export function initProvide (vm) {
    const provide = vm.$options.provide
    if (provide) {
        vm._provided = typeof provide === 'function'
            ? provide.call(vm)
            : provide
    }
}
