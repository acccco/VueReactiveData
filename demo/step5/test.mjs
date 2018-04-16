import Watcher from './Watcher'
import {observe} from "./Observe"

let object = {
    num1: 1,
    num2: 1,
    objectTest: {
        num3: 1
    }
}

observe(object)

let watcher = new Watcher(object, function () {
    return this.num1 + this.num2 + this.objectTest.num3
}, function (newValue, oldValue) {
    console.log(`监听函数，${object.num1} + ${object.num2} + ${object.objectTest.num3} = ${newValue}`)
})

object.num1 = 2
// 监听函数，2 + 1 + 1 = 4
object.objectTest.num3 = 2
// 监听函数，2 + 1 + 2 = 5