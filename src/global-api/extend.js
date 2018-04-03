import { ASSET_TYPES } from "../util/constants"
import { defineComputed, proxy } from '../instance/state'
import { mergeOptions } from "../util/vue-util/options"

export function initExtend (Vue) {
    // cid 用于判断 Vue 派生出来的子类的 ID
    Vue.cid = 0
    let cid = 1

    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        // 缓存 extend 出来的子类
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }

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

        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        // TODO 暂不了解为什么要怎么做
        /*if (Sub.options.props) {
            initProps(Sub)
        }
        if (Sub.options.computed) {
            initComputed(Sub)
        }*/

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

        // 缓存当前实例，保存在 option._Ctor 中
        cachedCtors[SuperId] = Sub
        return Sub
    }
}

// 将 Comp.prototype[key] 代理到 Comp._props[key]
// TODO 这段不是很理解，为什么要代理 _props，而且这个 _props 哪里来的？
function initProps (Comp) {
    const props = Comp.options.props
    for (const key in props) {
        proxy(Comp.prototype, `_props`, key)
    }
}
// 绑定计算属性
function initComputed (Comp) {
    const computed = Comp.options.computed
    for (const key in computed) {
        defineComputed(Comp.prototype, key, computed[key])
    }
}