import {toArray} from "../util/normal-util.mjs";
import {updateListeners} from "../vdom/helper/update-listeners";

export function initEvents(vm) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false
    // $options._parentListeners 为父组件下对应事件的处理函数
    const listeners = vm.$options._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}

let target

function add (event, fn, once) {
    if (once) {
        target.$once(event, fn)
    } else {
        target.$on(event, fn)
    }
}

function remove (event, fn) {
    target.$off(event, fn)
}

export function updateComponentListeners (vm, listeners, oldListeners) {
    target = vm
    updateListeners(listeners, oldListeners || {}, add, remove, vm)
    target = undefined
}

export function eventsMixin(Vue) {
    const hookRE = /^hook:/
    // 添加事件
    Vue.prototype.$on = function (event, fn) {
        const vm = this
        // 处理事件名是数组的情况
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                this.$on(event[i], fn)
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn)
            if (hookRE.test(event)) {
                vm._hasHookEvent = true
            }
        }
        return vm
    }
    // 触发一次的事件
    Vue.prototype.$once = function (event, fn) {
        const vm = this

        function on() {
            vm.$off(event, on)
            fn.apply(vm, arguments)
        }

        on.fn = fn
        vm.$on(event, on)
        return vm
    }
    // 取消事件
    Vue.prototype.$off = function (event, fn) {
        const vm = this
        // 清空所有事件
        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }
        // 清空一个事件列表
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                this.$off(event[i], fn)
            }
            return vm
        }
        // 若没有事件对应的函数列表则不用处理
        const cbs = vm._events[event]
        if (!cbs) {
            return vm
        }
        // 清空特定的事件对应的事件队列
        if (!fn) {
            vm._events[event] = null
            return vm
        }
        // 删除某个事件对应的特定的处理函数
        if (fn) {
            let cb
            let i = cbs.length
            while (i--) {
                cb = cbs[i]
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
        }
        return vm
    }
    // 以上3个方法主要是对当前对下事件队列的管理
    // 触发事件
    Vue.prototype.$emit = function (event) {
        const vm = this
        // 触发事件
        let cbs = vm._events[event]
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs
            const args = toArray(arguments, 1)
            for (let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(vm, args)
                } catch (e) {
                    console.log(e)
                }
            }
        }
        return vm
    }
}