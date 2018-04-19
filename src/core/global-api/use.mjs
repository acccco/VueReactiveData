import {toArray} from '../../util/normal-util'

export function initUse(Vue) {
    Vue.use = function (plugin) {
        // this._installedPlugins 保存已生效的插件
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // 获取额外的参数，并将 Vue 类作为第一个参数传入需要注册的插件中
        const args = toArray(arguments, 1)
        args.unshift(this)
        // plugin.install 是一个函数的话说明 plugin 为一个对象，则将需要的上下文环境传入
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }
        installedPlugins.push(plugin)
        return this

    }
}