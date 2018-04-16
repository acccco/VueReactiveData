import Watcher from './Watcher'
import {observe} from "./Observe"

let object = {
    arrayTest: [1, 2, 3, 4, 5]
}

observe(object)

let watcher = new Watcher(object, function () {
    return this.arrayTest.reduce((sum, num) => sum + num)
}, function (newValue, oldValue) {
    console.log(`监听函数，数组内所有元素 = ${newValue}`)
})

object.arrayTest.push(10)
// 监听函数，数组内所有元素 = 25

object.arrayTest[1] = 10
// 无效，但要注意的是并不是数组索引不能被 defineReactive
// 但是对于数组，我们并不能一开始就确定数组的长度，所以一开始定义索引的 get/set 并没有什么用
// 所以这里并没有对索引使用 defineReactive
object.arrayTest.$apply()
// 监听函数，数组内所有元素 = 33
// 用提供的方法触发更新

let obj2 = {
    arrayTest: [{num: 1}, {num: 2}, {num: 3}, {num: 4}]
}

observe(obj2)

let watcher2 = new Watcher(obj2, function () {
    return this.arrayTest.reduce((sum, {num}) => sum + num, 0)
}, function (newValue, oldValue) {
    console.log(`监听函数，数组内所有元素 = ${newValue}`)
})

obj2.arrayTest[0].num = 10
// 监听函数，数组内所有元素 = 19
obj2.arrayTest.push({num: 5})
// 监听函数，数组内所有元素 = 24
// 由于未监听数组索引，为数组添加了一个方法
obj2.arrayTest[5] = {num: 6}
obj2.arrayTest.$apply()
// 监听函数，数组内所有元素 = 30

watcher2.teardown()

obj2.arrayTest[0].num = 11
// 取消监听，无输出

watcher2.reset()

obj2.arrayTest[0].num = 15
// 监听函数，数组内所有元素 = 35