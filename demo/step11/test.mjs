import {Vue} from './Vue.mjs'

let subVue = Vue.extend({
    data() {
        return {
            dataTest: 1
        }
    },
    methods: {
        methodTest() {
            console.log('methodTest')
        }
    },
    watch: {
        'dataTest'(newValue, oldValue) {
            console.log('watchTest newValue = ' + newValue)
        }
    },
    computed: {
        'computedTest': {
            get() {
                return this.dataTest + 1
            }
        }
    }
})

let test = new subVue({
    data() {
        return {
            subData: 11
        }
    },
    methods: {
        subMethod() {
            console.log('subMethodTest')
        }
    },
    watch: {
        'subData'(newValue, oldValue) {
            console.log('subWatch newValue = ' + newValue)
        }
    },
    computed: {
        'subComputed': {
            get() {
                return this.subData + 1
            }
        }
    }
})

console.log(test.dataTest)
// 1
console.log(test.subData)
// 11

console.log(test.computedTest)
// 2
console.log(test.subComputed)
// 12

test.methodTest()
// methodTest
test.subMethod()
// subMethodTest

test.dataTest = 2
// watchTest newValue = 2
test.subData = 12
// subWatch newValue = 12

console.log(test.constructor === subVue)
// true
console.log(subVue.super === Vue)
// true
