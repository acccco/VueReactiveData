import {remove} from "../util/normal-util"

let uid = 0

/**
 * 一个拥有 update 方法的对象的集合，调用 notify 会对用数组下所有对象的 update 方法
 */
export default class Dep {
    static target;
    id;
    subs;

    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        remove(this.subs, sub)
    }

    // 供外部调用，将当前的 dep 添加到 Dep.target 上
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    // 调用 dep 保存的所有对象的 update 方法
    notify() {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// 当 Dep.target 有值时，则标志着需要对保存在这个变量下面的对象做一些处理
Dep.target = null
const targetStack = []

// 同上
export function pushTarget(_target) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

export function popTarget() {
    Dep.target = targetStack.pop()
}
