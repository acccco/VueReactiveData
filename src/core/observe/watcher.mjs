import {parsePath} from "../util/vue-util/lang";
import Dep from "./dep";
import {traverse} from "./traverse";
import {queueWatcher} from "./scheduler";
import {isObject, remove} from "../util/normal-util";

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
    /*vm: Component;
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean;
    lazy: boolean;
    sync: boolean;
    dirty: boolean;
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: SimpleSet;
    newDepIds: SimpleSet;
    getter: Function;
    value: any;*/

    /**
     * @param vm
     * @param expOrFn                需要监听的值或是取值函数
     * @param cb                     监听回调
     * @param options                对于该监听的设置
     * @param isRenderWatcher        用于判断是否是在render的时候的监听
     */
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm
        // 在 vm 下保存当前 watcher 用于触发 update 钩子
        if (isRenderWatcher) {
            vm._watcher = this
        }
        vm._watchers.push(this)
        // 配置项
        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        this.cb = cb
        // 每个 watcher 对应的 id
        this.id = ++uid
        // 标志这个 watcher 是否有效
        this.active = true
        // lazy 用于判断该 watcher 是否会主动触发变化
        // 若该 watcher 不会主动触发，则由 dirty 标志是否需要重新获取值
        this.dirty = this.lazy
        // 以下4个字段主要用于整理 watcher 和 dep 的双向关联关系
        // 用于解除 watcher 和 dep 的依赖关系
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.expression = expOrFn.toString()
        // 确定取值函数
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
        }
        this.value = this.lazy
            ? undefined
            : this.get()
    }

    /**
     * 为对应属性添加依赖，由于依赖收集必须进行一次取值，触发对象下属性的 get 方法，同时处理 deep
     */
    get() {
        Dep.target = this
        let value
        const vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            console.log(e)
        } finally {
            // 如果是需要深度监听对象下的变化，则需要对对象下每个属性都进行一次取值
            if (this.deep) {
                // 对其子项添加依赖
                traverse(value)
            }
            Dep.target = null
            this.cleanupDeps()
        }
        return value
    }

    /**
     * 为该 watcher 添加一个 dep
     */
    addDep(dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * 更新依赖
     */
    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this)
            }
        }
        // 引用对换，更换新值
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * 订阅的接口
     * 当依赖发生变化的时候，会执行
     */
    update() {
        // lazy 不立即更新，交由之后的脏检查处理
        // 一般出现在计算属性等一些没有回调函数的 watcher 上
        if (this.lazy) {
            this.dirty = true
        // TODO sync 出现情况未知，同步还是双向绑定待确定
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * 提供队列调用
     */
    run() {
        if (this.active) {
            const value = this.get()
            if (
                value !== this.value ||
                // 深度监听对象，由于将依赖绑在了子对象下，所以只要是触发了就要执行，而不需要判断值有没有变化
                isObject(value) ||
                this.deep
            ) {
                // 设置新值
                const oldValue = this.value
                this.value = value
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }

    /**
     * 脏检查机制需要手动触发
     */
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    /**
     * 将该 watcher 下的每个 dep 都添加该 watcher
     */
    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }

    /**
     * 取消掉 watch 和 dep 的双向关联
     */
    teardown() {
        if (this.active) {
            // 从 vm._watchers 的关联中移除
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this)
            }
            // 从 deps 的关联中移除
            let i = this.deps.length
            while (i--) {
                this.deps[i].removeSub(this)
            }
            this.active = false
        }
    }
}
