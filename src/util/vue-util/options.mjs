import {nativeWatch} from './env'

import {
    ASSET_TYPES,
    LIFECYCLE_HOOKS
} from '../constants'

import {
    extend,
    hasOwn,
    camelize,
    isPlainObject
} from '../normal-util'

/**
 * 该对象用于保存 option 下各字段的合并方法
 */
const strats = {}


/**
 * 合并对象方法，深度合并
 */
function mergeData(to, from) {
    if (!from) return to
    let key, toVal, fromVal
    const keys = Object.keys(from)
    for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        toVal = to[key]
        fromVal = from[key]
        if (!hasOwn(to, key)) {
            to[key] = fromVal
        } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
            mergeData(toVal, fromVal)
        }
    }
    return to
}

/**
 * Data
 * 合并 data 的实际方法
 */
export function mergeDataOrFn(parentVal, childVal, vm) {
    // 在 Vue.extend 中调用该方法是没用 vm 属性的，需分开处理
    if (!vm) {
        if (!childVal) {
            return parentVal
        }
        if (!parentVal) {
            return childVal
        }
        // 返回一个方法，供组件初始化的时候调用
        return function mergedDataFn() {
            return mergeData(
                typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
            )
        }
    } else {
        // 同上，只不过当有 vue 实例时，需绑定 call 调用时的上下文环境，也就时说在 create 时可以在函数内部使用 this
        return function mergedInstanceDataFn() {
            const instanceData = typeof childVal === 'function'
                ? childVal.call(vm, vm)
                : childVal
            const defaultData = typeof parentVal === 'function'
                ? parentVal.call(vm, vm)
                : parentVal
            if (instanceData) {
                return mergeData(instanceData, defaultData)
            } else {
                return defaultData
            }
        }
    }
}

// option 下的 data 属性的合并方法
strats.data = function (parentVal, childVal, vm) {
    return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * 生命周期函数的合并方法
 * 将生命周期函数合并到一个数组中，由于函数未真正调用，所以并不需要设置上下文环境
 */
function mergeHook(parentVal, childVal) {
    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : Array.isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

/**
 * Assets
 * 由于 components/directives/filters 的存储方式都为 { key: value } 的形式所以合并方法一致
 */
function mergeAssets(parentVal, childVal, vm, key) {
    const res = Object.create(parentVal || null)
    if (childVal) {
        return extend(res, childVal)
    } else {
        return res
    }
}

ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets
})

/**
 * 合并 watch
 * 结果
 * {
 *   xxx: [Function/Object, Function/Object...]
 * }
 */
strats.watch = function (parentVal, childVal, vm, key) {
    // 由于 Firefox 下对象默认有 watch 方法，做兼容处理，nativeWatch 为 Object 自带的方法
    if (parentVal === nativeWatch) parentVal = undefined
    if (childVal === nativeWatch) childVal = undefined

    if (!childVal) return Object.create(parentVal || null)
    if (!parentVal) return childVal
    const ret = {}
    extend(ret, parentVal)
    for (const key in childVal) {
        let parent = ret[key]
        const child = childVal[key]
        if (parent && !Array.isArray(parent)) {
            parent = [parent]
        }
        ret[key] = parent
            ? parent.concat(child)
            : Array.isArray(child) ? child : [child]
    }
    return ret
}

/**
 * 一些其他属性的合并方法
 */
strats.props =
    strats.methods =
        strats.inject =
            strats.computed = function (parentVal, childVal, vm, key) {
                if (!parentVal) return childVal
                const ret = Object.create(null)
                extend(ret, parentVal)
                if (childVal) extend(ret, childVal)
                return ret
            }
strats.provide = mergeDataOrFn

/**
 * 默认的合并方法
 * 若第二个参数有值，则使用第二个，否则使用第一个
 */
const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
        ? parentVal
        : childVal
}

/**
 * 确保所有的 props 有统一的结构
 * 最终各式化出来的结构
 * {
 *   xxx: {
 *     type: ..., // 若不是使用 object 则只有这个属性
 *     ...        // 使用 object 的还有其他属性，比如 require / default 等等
 *   }
 *   ...
 * }
 *
 */
function normalizeProps(options, vm) {
    const props = options.props
    if (!props) return
    const res = {}
    let i, val, name
    if (Array.isArray(props)) {
        i = props.length
        while (i--) {
            val = props[i]
            if (typeof val === 'string') {
                name = camelize(val)
                res[name] = {type: null}
            }
        }
    } else if (isPlainObject(props)) {
        for (const key in props) {
            val = props[key]
            name = camelize(key)
            res[name] = isPlainObject(val)
                ? val
                : {type: val}
        }
    }
    options.props = res
}

/**
 * 确保 inject 有统一的结构
 * 最终各式化出来的结构
 * {
 *   xxx: {
 *     from: ..., // 若不是使用 object 则只有这个属性，表示需要从父组件取的属性名称
 *     ...        // 使用 object 的还有其他属性，比如 default 等等
 *   }
 *   ...
 * }
 */
function normalizeInject(options, vm) {
    const inject = options.inject
    if (!inject) return
    const normalized = options.inject = {}
    if (Array.isArray(inject)) {
        for (let i = 0; i < inject.length; i++) {
            normalized[inject[i]] = {from: inject[i]}
        }
    } else if (isPlainObject(inject)) {
        for (const key in inject) {
            const val = inject[key]
            normalized[key] = isPlainObject(val)
                ? extend({from: key}, val)
                : {from: val}
        }
    }
}

/**
 * 指令有两种写法，处理成同一种写法
 * 最终格式化出来的结果
 * {
 *   xxx: {
 *     bind: Function                // 这个肯定会有，当指定被绑定的时候触发
 *     update: Function              // 这个肯定会有，所在组件的 VNode 更新时调用
 *     inserted: Function            // 被绑定元素插入父节点时调用
 *     componentUpdated: Function    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
 *     unbind: Function              // 只调用一次，指令与元素解绑时调用
 *   }
 * }
 */
function normalizeDirectives(options) {
    const dirs = options.directives
    if (dirs) {
        for (const key in dirs) {
            const def = dirs[key]
            if (typeof def === 'function') {
                dirs[key] = {bind: def, update: def}
            }
        }
    }
}

/**
 * 将两个 option 对象合并成一个对象
 */
export function mergeOptions(parent, child, vm) {

    // 如果 child 为 Vue 类，那么直接取 child.options
    if (typeof child === 'function') {
        child = child.options
    }

    // props inject directives 有多种写法，处理成同一种格式
    normalizeProps(child, vm)
    normalizeInject(child, vm)
    normalizeDirectives(child)
    // 扩展的组件，继承某个组件的 option，当有该字段时，需要继续去合并需要继承的 option
    const extendsFrom = child.extends
    if (extendsFrom) {
        parent = mergeOptions(parent, extendsFrom, vm)
    }
    // 和 extend 类似，其实最终调用的方法也是一样的，只不过 mixins 可以传多个
    // 而且从这儿看 mixins 拥有比 extends 中同名方法更高的优先级
    if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
    // 将所有子父组件中有的字段过滤一遍，保存在 options 中
    const options = {}
    let key
    for (key in parent) {
        mergeField(key)
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key)
        }
    }

    // strat 中保存着所有字段合并的处理方法
    function mergeField(key) {
        const strat = strats[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }

    return options
}
