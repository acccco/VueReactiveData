import { ASSET_TYPES } from "../util/constants"
import { initUse } from "./use"
import { initAssetRegisters } from "./asstes"
import { initExtend } from "./extend"

export function initGlobalApi(Vue) {

    // 设置 option 为一个对象
    Vue.options = Object.create(null)

    // 设置 components directives filters 为空对象
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null)
    })

    // 保存原始 Vue 类对象
    Vue.options._base = Vue

    // 挂载注册中间件函数
    initUse(Vue)

    // 实现子类生成方法
    initExtend(Vue)

    // 生成注册全局的 component/directive/filter 方法
    initAssetRegisters(Vue)
}