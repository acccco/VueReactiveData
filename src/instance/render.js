export function initRender(vm) {
    vm._vnode = null // the root of the child tree
    vm._staticTrees = null // 使用 v-once 的话只绑定数据一次，这个字段用于保存第一次生成的 dom 结构

    // TODO 先不考虑 DOM 的实现
    // 绑定 $createElement 方法，供之后调用
    // vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    // vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    // TODO 先不考虑
    // 获取到 parentData
    // const parentData = parentVnode && parentVnode.data
    // 将当前实例的 $attrs $listeners 分别代理到 parentData.attrs 和 options._parentListeners 上
    // defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    // defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}