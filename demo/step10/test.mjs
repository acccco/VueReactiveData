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
                return this.firstName + ' ' + this.lastName
            }
        },
        computedSet: {
            get() {
                return this.firstName + ' ' + this.lastName
            },
            set(value) {
                let names = value.split(' ')
                this.firstName = names[0]
                this.lastName = names[1]
            }
        }
    }
})
// 测试缓存 （刚绑定 watcher 时会调用一次 get 进行依赖绑定）
console.log('-------------')
console.log(test.computedValue)
// 测试缓存
// aco Yang
console.log(test.computedValue)
// acoYang （缓存成功，并没有调用 get 函数）

test.firstName = 'acco'
console.log(test.computedValue)
// 测试缓存 （当依赖发生变化时，就会调用 get 函数）
// acco Yang

test.computedSet = 'accco Yang'
console.log(test.computedValue)
// 测试缓存 （通过 set 使得依赖发生了变化）
// accco Yang