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
            console.log('methodTest')
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
console.log(test.subData)

console.log(test.computedTest)
console.log(test.subComputed)

test.methodTest()
test.subMethod()

test.dataTest = 2
test.subData = 12

console.log(test.constructor === subVue)
console.log(subVue.super === Vue)
