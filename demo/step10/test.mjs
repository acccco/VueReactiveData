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

console.log(test.computedValue)
console.log(test.computedValue)

test.firstName = 'acco'
console.log(test.computedValue)