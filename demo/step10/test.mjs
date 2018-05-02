import {Vue} from "./Vue";

let test = new Vue({
    data() {
        return {
            firstName: 'aco',
            lastName: 'Yang'
        }
    },
    computed: {
        computedValue: {
            get() {
                console.log('测试缓存')
                return this.firstName + this.lastName
            }
        }
    }
})
// 测试缓存 （刚绑定 watcher 时会调用一次 get 进行依赖绑定）
console.log('-------------')
console.log(test.computedValue)
// 测试缓存
// acoYang
console.log(test.computedValue)
// acoYang （缓存成功，并没有调用 get 函数）

test.firstName = 'acco'
console.log(test.computedValue)
// 测试缓存 （当依赖发生变化时，就会调用 get 函数）
// accoYang