let uid = 0

export class Event {
    constructor() {
        this.id = ++uid
        this._events = {}
    }

    $on(eventName, fn) {
        let object = this;
        // 若 _events 对象下无对应事件名，则新建一个数组，然后将处理函数推入数组
        (object._events[eventName] || (object._events[eventName] = [])).push(fn)
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

    $off(eventName) {
        let object = this
        const cbs = object._events[eventName]
        if (cbs) {
            // 取消置空即可
            object._events[eventName] = null
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