import { ASSET_TYPES } from "../util/constants"
import { defineComputed, proxy } from '../instance/state'
import { mergeOptions } from "../util/vue-util/options"
import {extend} from "../util/normal-util";

export function initExtend (Vue) {

    // cid 用于判断 Vue 派生出来的子类的 ID
    Vue.cid = 0
    let cid = 1

    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this

        const name = extendOptions.name || Super.options.name

        const Sub = function VueComponent (options) {
            this._init(options)
        }
        // 获取 Super.prototype 下的方法
        Sub.prototype = Object.create(Super.prototype)
        //  修正 constructor
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        // 合并 options
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        // 保存父类引用
        Sub['super'] = Super

        // 将 props 下的属性绑定到 this 下
        // this[key] = this._prop[key]
        if (Sub.options.props) {
            initProps(Sub)
        }

        if (Sub.options.computed) {
            initComputed(Sub)
        }

        // 获取 extension/mixin/plugin 方法
        Sub.extend = Super.extend
        Sub.mixin = Super.mixin
        Sub.use = Super.use

        // 获取到父类下的方法
        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type]
        })

        // 支持循环自身引用
        if (name) {
            Sub.options.components[name] = Sub
        }

        // 保留对父类的引用，用于在实例化的使用检查父类的相关值是否改变
        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)

        return Sub
    }
}

// 将 Comp.prototype[key] 代理到 Comp._props[key]
// 实例化后的效果为 this[key] = this._props[key]
function initProps (Comp) {
    const props = Comp.options.props
    for (const key in props) {
        proxy(Comp.prototype, `_props`, key)
    }
}

// 绑定计算属性
// 这里还没有添加 watcher
function initComputed (Comp) {
    const computed = Comp.options.computed
    for (const key in computed) {
        defineComputed(Comp.prototype, key, computed[key])
    }
}
