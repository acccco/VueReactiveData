export const emptyObject = Object.freeze({})

// 一些工具方法
export function isUndef(v) {
    return v === undefined || v === null
}

export function isDef(v) {
    return v !== undefined && v !== null
}

export function isTrue(v) {
    return v === true
}

export function isFalse(v) {
    return v === false
}

/**
 * 判断一个值是否是基础类型
 */
export function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

/**
 * 判断是否是一个对象
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * 获取到 toString 方法 e.g. [object Object]
 * toRawType 获取到值的类型
 */
const _toString = Object.prototype.toString

export function toRawType(value) {
    return _toString.call(value).slice(8, -1)
}

/**
 * 判断值是否是对象字面量
 */
export function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
}

/**
 * 判断值是否是正则对象
 */
export function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]'
}

/**
 * 判断是否是一个有效的数组索引
 */
export function isValidArrayIndex(val) {
    const n = parseFloat(String(val))
    return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 * 一个更通用的 toString 方法，能将对象转换成json
 */
export function toString(val) {
    return val == null
        ? ''
        : typeof val === 'object'
            ? JSON.stringify(val, null, 2)
            : String(val)
}

/**
 * 将一个可转换为数字值转换为数字，转换失败返回原值
 */
export function toNumber(val) {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}

/**
 * 生成一个 map，返回一个函数，用于判断参数是否在 map 中
 * 参一形式 xxx,xxx 用 , 分割
 * 参二是否将返回函数的参数进行小写处理
 */
export function makeMap(str, expectsLowerCase) {
    const map = Object.create(null)
    const list = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return expectsLowerCase
        ? val => map[val.toLowerCase()]
        : val => map[val]
}

/**
 * 判断一个标签是否为内建标签
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * 判断一个标签中的属性是否是 VUE 专用的
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * 从数组中删除一个元素
 */
export function remove(arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

/**
 * 判断某个对象是否拥有摸个字段
 */
const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key)
}

/**
 * 用于缓存传入函数的参数对应的结果，但是不能清空
 */
export function cached(fn) {
    const cache = Object.create(null)
    return function cachedFn(str) {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))
    }
}

/**
 * 将用 - 分割的字符串转换为驼峰命名
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * 将字符串第一个字母大写
 */
export const capitalize = cached((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * 将一个用驼峰命名的字符串用 - 分割
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * 比原生更快的 bind 方法
 */
export function bind(fn, ctx) {
    function boundFn(a) {
        const l = arguments.length
        return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx)
    }

    // record original fn length
    boundFn._length = fn.length
    return boundFn
}

/**
 * 将一个类数组转化为一个数组
 */
export function toArray(list, start) {
    start = start || 0
    let i = list.length - start
    const ret = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

/**
 * to 继承 from 下的属性，未嵌套调用
 */
export function extend(to, _from) {
    for (const key in _from) {
        to[key] = _from[key]
    }
    return to
}

/**
 * 将数组下的所有对象合并成同一个对象
 */
export function toObject(arr) {
    const res = {}
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i])
        }
    }
    return res
}

/**
 * 空实现的数组
 */
export function noop(a, b, c) {
}

/**
 * 总是返回错误
 */
export const no = (a, b, c) => false

/**
 * 返回原值
 */
export const identity = (_) => _

/**
 * Generate a static keys string from compiler modules.
 */
export function genStaticKeys(modules) {
    return modules.reduce((keys, m) => {
        return keys.concat(m.staticKeys || [])
    }, []).join(',')
}

/**
 * 判断两个值松相等，即对象下所有字段都相等则相等
 */
export function looseEqual(a, b) {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a)
            const isArrayB = Array.isArray(b)
            if (isArrayA && isArrayB) {
                return a.length === b.length && a.every((e, i) => {
                    return looseEqual(e, b[i])
                })
            } else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a)
                const keysB = Object.keys(b)
                return keysA.length === keysB.length && keysA.every(key => {
                    return looseEqual(a[key], b[key])
                })
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
}

/**
 * 使用松相等判断某个值在数组中的位置
 */
export function looseIndexOf(arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val)) return i
    }
    return -1
}

/**
 * 确保一个函数仅仅被调用一次
 */
export function once(fn) {
    let called = false
    return function () {
        if (!called) {
            called = true
            fn.apply(this, arguments)
        }
    }
}
