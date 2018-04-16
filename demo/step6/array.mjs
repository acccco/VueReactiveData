const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

/**
 * 改变数组的默认处理，将新添加的对象添加监听
 */
methodsToPatch.forEach(function (method) {
    // 原始的数组处理方法
    const original = arrayProto[method]
    let mutator = function (...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) ob.observeArray(inserted)
        // 触发 notify 方法
        ob.dep.notify()
        return result
    }
    Object.defineProperty(arrayMethods, method, {
        value: mutator,
        enumerable: false,
        writable: true,
        configurable: true
    })
})
