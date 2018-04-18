export function initEvents (vm) {
    vm._events = Object.create(null)
    vm._hasHookEvent = false
}

export function eventsMixin (Vue) {
    const hookRE = /^hook:/
    Vue.prototype.$on = function (event, fn) {
        const vm = this
        // 处理事件名是数组的情况
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                this.$on(event[i], fn)
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn)
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true
            }
        }
        return vm
    }

    Vue.prototype.$once = function (event, fn) {
        const vm = this
        function on () {
            vm.$off(event, on)
            fn.apply(vm, arguments)
        }
        on.fn = fn
        vm.$on(event, on)
        return vm
    }

    Vue.prototype.$off = function (event, fn) {
        const vm = this
        // all
        // 清空所有事件
        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }
        // array of events
        // 清空一个事件列表
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                this.$off(event[i], fn)
            }
            return vm
        }
        // specific event
        // 若没有事件对应的函数列表则不用处理
        const cbs = vm._events[event]
        if (!cbs) {
            return vm
        }
        // 清空特定的事件
        if (!fn) {
            vm._events[event] = null
            return vm
        }
        // 删除某个事件对应的特定的处理函数
        if (fn) {
            // specific handler
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
    // 触发事件
    Vue.prototype.$emit = function (event) {
        const vm = this
        // 事件名字不合法的话在非正式环境提示修改
        if (process.env.NODE_ENV !== 'production') {
            const lowerCaseEvent = event.toLowerCase()
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(
                    `Event "${lowerCaseEvent}" is emitted in component ` +
                    `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
                    `Note that HTML attributes are case-insensitive and you cannot use ` +
                    `v-on to listen to camelCase events when using in-DOM templates. ` +
                    `You should probably use "${hyphenate(event)}" instead of "${event}".`
                )
            }
        }
        // 触发事件
        let cbs = vm._events[event]
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs
            const args = toArray(arguments, 1)
            for (let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(vm, args)
                } catch (e) {
                    handleError(e, vm, `event handler for "${event}"`)
                }
            }
        }
        return vm
    }
}