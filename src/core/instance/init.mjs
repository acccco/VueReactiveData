import {mergeOptions} from "../../util/vue-util/options"
import {extend} from "../../util/normal-util";
import {callHook, initLifecycle} from "./lifecycle";
import {initEvents} from "./events";
import {initInjections, initProvide} from "./inject";
import {initState} from "./state";

let uid = 0

export function initMixin(Vue) {
    Vue.prototype._init = function (options = {}) {
        const vm = this
        // 每个实例对应的 id
        vm.uid = ++uid
        // 标记对象是否是 vue 对象
        vm._isVue = true

        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options,
            vm
        )

        // 保存自身实例
        vm._self = vm
        initLifecycle(vm)
        initEvents(vm)
        callHook(vm, 'beforeCreate')
        initInjections(vm)
        initState(vm)
        initProvide(vm)
        callHook(vm, 'created')
    }
}

export function resolveConstructorOptions(Ctor) {
    let options = Ctor.options
    // super 情况出现在使用 Vue.extend 生成的类，也就是 Vue 的子类
    if (Ctor.super) {
        // vue 树结构不仅仅只有一层，所以同样用该方法获取父类的 options
        const superOptions = resolveConstructorOptions(Ctor.super)
        const cachedSuperOptions = Ctor.superOptions
        if (superOptions !== cachedSuperOptions) {
            // 父类的 option 发生变化，需要生成新的 options
            Ctor.superOptions = superOptions
            // 上一步保存父类的 option 变化，除了父类的 option 发生变化，子类继承时传入的 extendOptions 也会发生变化
            // 当生成子类时 extendOptions 变化时，获取到变化内容
            const modifiedOptions = resolveModifiedOptions(Ctor)
            // 合并原始值和更新值
            if (modifiedOptions) {
                extend(Ctor.extendOptions, modifiedOptions)
            }
            // 更新当前类的 options
            options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
            // 支持自循环
            if (options.name) {
                options.components[options.name] = Ctor
            }
        }
    }
    return options
}

function resolveModifiedOptions(Ctor) {
    let modified
    const latest = Ctor.options
    const extended = Ctor.extendOptions
    const sealed = Ctor.sealedOptions
    for (const key in latest) {
        // 得到所有有变化的字段
        if (latest[key] !== sealed[key]) {
            if (!modified) modified = {}
            modified[key] = dedupe(latest[key], extended[key], sealed[key])
        }
    }
    return modified
}

function dedupe(latest, extended, sealed) {
    if (Array.isArray(latest)) {
        const res = []
        sealed = Array.isArray(sealed) ? sealed : [sealed]
        extended = Array.isArray(extended) ? extended : [extended]
        for (let i = 0; i < latest.length; i++) {
            // 这里取出的是在 extended 中或不在 sealed 中的项目
            if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
                res.push(latest[i])
            }
        }
        return res
    } else {
        return latest
    }
}