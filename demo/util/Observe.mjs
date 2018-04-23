import Dep from './Dep'
import {arrayMethods} from "./array"

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export function defineReactive(object, key, value) {
    let dep = new Dep()
    let childOb = observe(value)
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target)
                Dep.target.addDep(dep)
                if(Array.isArray(value)){
                    childOb.dep.addSub(Dep.target)
                    Dep.target.addDep(childOb.dep)
                }
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
        if (Array.isArray(value)) {
            this.dep = new Dep()
            const augment = ('__proto__' in {})
                ? protoAugment
                : copyAugment
            // 覆盖数组中一些改变了原数组的方法，使得方法得以监听
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
            
        } else {
            this.walk(value)
        }
        Object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
            writable: true,
            configurable: true
        })
    }

    /**
     * 遍历对象下属性，使得属性变成可监听的结构
     */
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }

    /**
     * 同上，遍历数组
     */
    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }

}

/**
 * 如果能使用 __proto__ 则将数组的处理方法进行替换
 */
function protoAugment (target, src, keys) {
    target.__proto__ = src
}

/**
 * 如果不能使用 __proto__ 则直接将该方法定义在当前对象下
 */
function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        Object.defineProperty(target, key, {
            value: src[key],
            enumerable: false,
            writable: true,
            configurable: true
        })
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