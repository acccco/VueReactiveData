let uid = 0

export class Event {
    constructor() {
        this.id = ++uid
        this._events = {}
    }

    $on(eventName, fn) {
        let object = this
        if (Array.isArray(eventName)) {                               // 处理事件名是数组的情况
            eventName.forEach(name => this.$on(name, fn))
        } else {
            if (!Array.isArray(fn)) {                                 // 处理处理函数为数组的情况
                fn = [fn]
            }
            // 若 _events 对象下无对应事件名，则新建一个数组，然后将处理函数推入数组
            (object._events[eventName] || (object._events[eventName] = [])).push(...fn)
        }
        return object
    }

    $once(eventName, fn) {
        let object = this

        function on() {
            // 先取消，然后触发，确保仅一次
            object.$off(eventName, on)
            fn.apply(object, arguments)
        }

        on.fn = fn
        object.$on(eventName, on)
        return object
    }

    $off(eventName, fn) {
        let object = this
        // 清空所有事件
        if (!arguments.length) {
            object._events = {}
            return object
        }
        // 清空多个事件
        if (Array.isArray(eventName)) {
            eventName.forEach(name => this.$off(name, fn))
            return object
        }
        // 若没有事件对应的函数列表则不用处理
        const cbs = object._events[eventName]
        if (!cbs) {
            return object
        }
        // 清空特定事件
        if (!fn) {
            object._events[eventName] = null
            return object
        }
        // 取消特定事件的特定处理函数
        if (fn) {
            let cb
            let i = cbs.length
            // 处理一次取消多个的情况
            if (Array.isArray(fn)) {
                fn.forEach(fnc => this.$off(eventName, fnc))
                return
            }
            while (i--) {
                cb = cbs[i]
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
        }
        return object
    }

    $emit(eventName, ...args) {
        let object = this
        let cbs = object._events[eventName]
        if (cbs) {
            cbs.forEach(func => func.apply(object, args))
        }
        return object
    }

}