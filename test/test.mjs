import Vue from '../src/index'

function watchFuc(newValue, oldValue) {
    console.log(newValue, oldValue)
}

let props = {
    propsA: 1,
    propsB: 2
}

let vm = new Vue({
    data: function () {
        return {
            baseTest: 1,
            objectTest: {
                value1: 1,
                value2: 2
            },
            arrayTest: [{value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}]
        }
    },
    // watch 测试
    watch: {
        'baseTest': watchFuc,
        'objectTest': {
            deep: true,
            handler: watchFuc
        },
        'arrayTest': {
            handler: watchFuc
        }
    },
    computed: {
        'computedTest': function () {
            return this.baseTest
        }
    },
    props: {
        propsTest: {
            type: Object,
            default: function () {
                return props
            }
        }
    },
    propsData: {
        propsTest: false
    }
})

vm.baseTest = 2
