/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
import {callHook} from "../instance/lifecycle";

let has = {}
let flushing = false
let waiting = false
const queue = []
const activatedChildren = []
let circular = {}
let index = 0

export function queueWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
        } else {
            // 如果队列已经在执行，则将该 watcher 添加到对应位置，因为是要按 id 的顺序执行的
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }
        // 如果该队列还没有执行，就执行他
        // TODO 源码中使用的 next-tick
        if (!waiting) {
            waiting = true
            setTimeout(flushSchedulerQueue)
        }
    }
}

/**
 * 执行队列
 */
function flushSchedulerQueue() {
    flushing = true
    let watcher, id

    // 根据 ID 顺序的执行，原因如下
    // 1. 组件的更新顺序是从父组件到子组件的，因为父组件都比子组件先创建
    // 2. 一个组件自己的 watchers 是在 render watcher 之前执行的，因为自己的 watcher 比 render 先创建
    // 3. 当一个组件的父组件运行 watcher 时，可能会被销毁，而销毁的 watchers 是不需要执行的
    queue.sort((a, b) => a.id - b.id)

    // 当依次执行队列中的 watcher 时，不应该缓存数组长度，因为当队列执行时，可能会有 watcher 加入进来
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index]
        id = watcher.id
        has[id] = null
        watcher.run()
    }

    // 保存队列信息，供之后调用
    const updatedQueue = queue.slice()

    resetSchedulerState()

    // 触发 update 方法钩子
    callUpdatedHooks(updatedQueue)
}

/**
 * 重置状态
 */
function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0
    has = {}
    circular = {}
    waiting = flushing = false
}

function callUpdatedHooks (queue) {
    let i = queue.length
    while (i--) {
        const watcher = queue[i]
        const vm = watcher.vm
        if (vm._watcher === watcher && vm._isMounted) {
            callHook(vm, 'updated')
        }
    }
}