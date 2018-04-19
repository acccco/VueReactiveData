import { ASSET_TYPES } from "../util/constants"
import { initUse } from "./use"
import { initAssetRegisters } from "./asstes"
import { initExtend } from "./extend"
import {initMixin} from "./mixin";

export function initGlobalApi(Vue) {

    // 设置 option 为一个对象
    Vue.options = Object.create(null)

    // 设置 components 为空对象(directives/filters 和渲染相关暂时不管)
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null)
    })

    // 保存原始 Vue 类对象
    Vue.options._base = Vue

    // 挂载注册中间件函数
    initUse(Vue)

    // 全局混入，并不会生成一个新的类，而是之后所有创建的类都会有影响，所以慎用，或者用 extend 来实现
    initMixin(Vue)

    // 实现子类生成方法
    initExtend(Vue)

    // 生成注册全局的 component 方法 (directive/filter 和渲染相关暂时不管)
    initAssetRegisters(Vue)
}