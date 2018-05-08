import R from 'ramda'

export function mergeOptions(parent, child) {
    // data/methods/watch/computed
    // 直接合并，避免 parent 和 child 中的属性丢失
    let options = R.mergeAll([{}, parent, child])

    // 合并 data
    options.data = mergeData(parent.data, child.data)

    // 合并 methods 同名覆盖
    options.methods = R.merge(parent.methods, child.methods)

    // 合并 watcher 同名合并成一个数组
    options.watch = mergeWatch(parent.watch, child.watch)

    // 合并 computed 同名覆盖
    options.computed = R.merge(parent.computed, child.computed)

    return options
}

function mergeData(parentValue, childValue) {
    if (!parentValue) {
        return childValue
    }
    if (!childValue) {
        return parentValue
    }
    return function mergeFnc() {
        return R.merge(parentValue.call(this), childValue.call(this))
    }
}

function mergeWatch(parentVal, childVal) {
    if (!childVal) return R.clone(parentVal || {})
    let ret = R.merge({}, parentVal)
    for (let key in childVal) {
        let parent = ret[key]
        let child = childVal[key]
        if (parent && !Array.isArray(parent)) {
            parent = [parent]
        }
        ret[key] = parent
            ? parent.concat(child)
            : Array.isArray(child) ? child : [child]
    }
    return ret
}