import {toArray} from "../../src/util/normal-util";

let uid = 0

export class Event {
    constructor() {
        this.id = ++uid
        this._events = {}
    }

    $on(eventName, fn) {
        const object = this
        // 处理事件名是数组的情况
        if (Array.isArray(eventName)) {
            for (let i = 0, l = eventName.length; i < l; i++) {
                this.$on(eventName[i], fn)
            }
        } else {
            (object._events[eventName] || (object._events[eventName] = [])).push(fn)
        }
        return object
    }

    $once(eventName, fn) {
        const object = this

        function on() {
            object.$off(eventName, on)
            fn.apply(object, arguments)
        }

        on.fn = fn
        object.$on(eventName, on)
        return object
    }

    $off(eventName) {
        const object = this
        // 清空所有事件
        if (!arguments.length) {
            object._events = Object.create(null)
            return object
        }
        // 若没有事件对应的函数列表则不用处理
        const cbs = object._events[eventName]
        if (cbs) {
            object._events[eventName] = null
        }
        return object
    }

    $emit(eventName) {
        const object = this
        // 触发事件
        let cbs = object._events[eventName]
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs
            const args = toArray(arguments, 1)
            for (let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(object, args)
                } catch (e) {
                    console.log(e)
                }
            }
        }
        return object
    }

}