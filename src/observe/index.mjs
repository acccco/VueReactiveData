import {def} from "../util/vue-util/lang";
import Dep from "./dep";
import {hasOwn, isObject, isPlainObject} from "../util/normal-util";
import {arrayMethods} from "./array";
import {hasProto} from "../util/vue-util/env";

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 一般情况下，数据都是响应式的，但是如果是 props 的话由于在父组件里面已经监听一次了，所以没必要在子组件里监听
 * 但如果使用的是默认值的话还是需要监听的
 * 该变量标志着是否对传入 observe 的对象进行监听
 */
export const observerState = {
    shouldConvert: true
}

/**
 * 收集依赖
 */
export class Observer {

    constructor(value) {
        this.value = value
        // 这个 ob 主要是对一些未监听变量补充，因为这个 ob 下保存的是这个对象的监听
        // 比如，一般上 监听{a:{b:1}}
        // 会在 a 的 set 和 get 上收集依赖和触发依赖
        // 但是当有如下操作时：a.c = 1，由于是新添加的属性，并不能做到依赖的收集
        // 所以便有了这个 dep，看源码中主要在处理数组函数，以及 set 方法中使用
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            const augment = hasProto
                ? protoAugment
                : copyAugment
            // 覆盖数组中一些不改变数组引用的方法，使得方法得以监听
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
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
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}


/**
 * 如果能使用 __proto__ 则将数组的处理方法放在该对象下
 * 根据原型链，先会找到该方法，而不是数组对象下的方法，实现替换处理方法
 */
function protoAugment(target, src, keys) {
    target.__proto__ = src
}

/**
 * 如果不能使用 __proto__ 则直接将该方法定义在当前对象下
 */
function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

/**
 * 将传入值转换为可监听结构，是对 Observer 的一个包装，使得外部直接调用即可
 */
export function observe(value, asRootData) {
    // 原判断中有 value instanceof VNode 这里先去掉
    // TODO vNode 也是个对象，但不需要监听
    if (!isObject(value)) {
        return
    }
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        observerState.shouldConvert &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value)
    }
    if (asRootData && ob) {
        // 根节点监听计数
        ob.vmCount++
    }
    return ob
}

/**
 * shallow 用于判断传入对象是否需要添加监听
 */
export function defineReactive(obj, key, val, customSetter, shallow) {
    const dep = new Dep()

    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    // 获取到原来的 get/set
    const getter = property && property.get
    const setter = property && property.set

    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            // 如果对象设置过 getter 的话，使用 getter 来取值
            const value = getter ? getter.call(obj) : val
            // 如果值相同的话不做任何事
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            // 如果有自定义的 setter 则使用 给的 setter 赋值
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = !shallow && observe(newVal)
            dep.notify()
        }
    })
}

/**
 * 由于数组不能像对象拥有自定义的 get/set 所以只能将 dep 保存到对应的变量下
 * 具体的使用等添加 set 机制后细看
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i]
        e && e.__ob__ && e.__ob__.dep.depend()
        if (Array.isArray(e)) {
            dependArray(e)
        }
    }
}

/**
 * 用于添加在非 data 已经数组中的响应属性
 */
export function set (target, key, val) {
    if (Array.isArray(target)) {
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = target.__ob__
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}

