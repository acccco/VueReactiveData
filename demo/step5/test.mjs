import Watcher from './Watcher'
import {observe} from "./Observe"

let object = {
    num1: 1,
    num2: 1
}

observe(object)

let watcher = new Watcher(object, function () {
    console.log('watcher')
    return this.num1 + this.num2
}, function (newValue, oldValue) {
    console.log(`监听函数，${object.num1} + ${object.num2} = ${newValue}`)
})

object.num1 = 2
// 监听函数，2 + 1 = 3