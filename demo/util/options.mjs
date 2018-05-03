
export function mergeOptions(parent, child, ctx) {
    // data/methods/watcher/computed
    let options = {}

    options.data = mergeData(parent.data, child.data, ctx)

    return options
}
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function deepClone(to, from) {
    if (!from) return to
    let key, toVal, fromVal
    const keys = Object.keys(from)
    for (let i = 0; i < keys.length; i++) {
        key = keys[i]
        toVal = to[key]
        fromVal = from[key]
        if (!Object.prototype.hasOwnProperty(to, key)) {
            to[key] = fromVal
        } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
            deepClone(toVal, fromVal)
        }
    }
    return to
}

function mergeData(parentValue, childValue, ctx) {
    if (!parentValue) {
        return childValue
    }
    if (!childValue) {
        return parentValue
    }
    return function mergeFnc() {
        return deepClone(parentValue.call(this), childValue.call(this))
    }
}