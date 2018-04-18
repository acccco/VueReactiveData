import Vue from '../src/index'
import Watcher from '../src/observe/watcher'
import dot from 'dot'

let template = '<span>{{=it.baseTest}}</span><span>{{=it.returnTest()}}</span><span>{{=it.propsTest.propsA}}</span>'

let temFun = dot.template(template)

function watchFuc(newValue, oldValue) {
    console.log('---- watcher start ----')
    console.log(newValue, oldValue)
    console.log('---- watcher end   ----')
}

let props = {
    propsA: 1,
    propsB: 2
}

let vm = new Vue({
    created() {
        this.$on('eventTest', () => {
            console.log('eventTest')
        })
        this.methodsTest()
    },
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
        computedTest() {
            return this.baseTest
        }
    },
    props: {
        propsTest: {
            type: Object,
            default() {
                return props
            }
        }
    },
    propsData: {
        // propsTest: false
    },
    methods: {
        methodsTest() {
            console.log('methodsTest')
            setTimeout(() => {
                this.$emit('eventTest')
            }, 1000)
        },
        returnTest() {
            return this.baseTest
        }
    },
    render() {
        console.log('template')
        console.log(temFun(this))
    }
})

vm.$options.render.call(vm, {a: 1})

new Watcher(vm, '_data', () => {
    vm.$options.render.call(vm)
}, {
    deep: true
}, true)

vm.baseTest = 2

props.propsA = 2