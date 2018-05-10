export function proxy(target, sourceKey, key) {
    let sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get() {
        },
        set() {
        }
    }
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function getProvideForInject(ctx, key, defaultValue) {
    let parent = ctx.$parent
    let value = defaultValue
    while (parent) {
        if (parent._provide && key in parent._provide) {
            value = parent._provide[key]
            break
        }
        parent = parent.$parent
    }
    return value
}