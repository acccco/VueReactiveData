export function initLifecycle(vm) {
    const options = vm.$options

    let parent = options.parent
    // 将该节点放到父节点的 $children 列表中
    if (parent) {
        parent.$children.push(vm)
    }
    // 设置父节点和根节点
    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    // 初始化 $children 和 $refs 列表
    vm.$children = []

    vm._watcher = null
    // 组件刚生成，以下状态为 false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
}

export function callHook (vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                console.log(e)
            }
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook)
    }
}