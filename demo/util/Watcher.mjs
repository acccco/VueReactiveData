import Dep from './Dep'

let uid = 0

export default class Watcher {

    constructor(object, getter, callback, options) {
        this.id = ++uid
        this.obj = object
        this.getter = getter
        this.cb = callback
        this.deps = []
        this.value = this.get()
        if (options) {
            this.lazy = !!options.lazy
        } else {
            this.lazy = false
        }
        this.dirty = this.lazy
    }

    get() {
        Dep.target = this
        let value = this.getter.call(this.obj)
        Dep.target = null
        return value
    }

    update() {
        if (this.lazy) {
            this.dirty = true
            return
        }
        const value = this.getter.call(this.obj)
        const oldValue = this.value
        this.value = value
        this.cb.call(this.obj, value, oldValue)
    }

    /**
     * 脏检查机制手动触发更新函数
     */
    evaluate() {
        this.value = this.getter.call(this.obj)
        this.dirty = false
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    teardown() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].removeSub(this)
        }
        this.deps = []
    }

    reset() {
        this.get()
    }

}