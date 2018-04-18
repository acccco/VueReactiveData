import Vue from '../src/index'
import Watcher from '../src/observe/watcher'
import dot from 'dot'

let template = '<span>{{=it.baseTest}}</span><span>{{=it.returnTest()}}</span>'

let temFun = dot.template(template)

function watchFuc(newValue, oldValue) {
    // console.log(newValue, oldValue)
}

let props = {
    propsA: 1,
    propsB: 2
}

let tempalte = '<span>${this.baseTest}</span>'

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
    },
    methods: {
        methodsTest() {
            console.log('methodsTest')
            setTimeout(() => {
                this.$emit('eventTest')
            }, 3000)
        },
        returnTest(){
            return this.baseTest
        }
    },
    render(renderOptions) {
        console.log('template')
        console.log(renderOptions)
        console.log(temFun(this))
    }
})

vm.$options.render.call(vm, {a: 1})

new Watcher(vm, '_data', () => {
    vm.$options.render.call(vm, {a: 1})
}, {
    deep: true
}, true)

vm.baseTest = 2
