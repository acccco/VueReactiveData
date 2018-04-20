import Dep from './Dep'

export function defineReactive(object, key, value) {
    let dep = new Dep()
    observe(value)
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target)
                Dep.target.addDep(dep)
            }
            return value
        },
        set: function (newValue) {
            if (newValue !== value) {
                value = newValue
                dep.notify()
            }
        }
    })
}

export class Observer {

    constructor(value) {
        this.value = value
        this.walk(value)
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })
    }

    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }

}

export function observe (value) {
    if (typeof value !== 'object') {
        return
    }
    let ob
    if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (Object.isExtensible(value)) {
        ob = new Observer(value)
    }
    return ob
}