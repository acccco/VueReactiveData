import {Vue} from "./Vue";

let test = new Vue({
    data() {
        return {
            firstName: 'aco',
            lastName: 'Yang'
        }
    },
    computed: {
        computedValue1: {
            get() {
                console.log('测试缓存')
                return this.firstName + this.lastName
            }
        },
        computedValue2: {
            get() {
                return this.lastName + this.firstName
            }
        },
    }
})
// 测试缓存 （刚绑定 watcher 时会调用一次 get 进行依赖绑定）
console.log('-------------')
console.log(test.computedValue1)
// 测试缓存
// acoYang
console.log(test.computedValue1)
// acoYang （缓存成功，并没有调用 get 函数）

test.firstName = 'acco'
console.log(test.computedValue1)
// 测试缓存 （当依赖发生变化时，就会调用 get 函数）
// accoYang

console.log(test.computedValue2)
// Yangacco