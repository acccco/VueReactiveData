import Vue from '../src/core/index'
import Watcher from '../src/core/observe/watcher'
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
    name: 'root',
    created() {
        /*this.$on('eventTest', () => {
            console.log('eventTest')
        })
        this.methodsTest()*/
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
    /*watch: {
        'baseTest': watchFuc,
        'objectTest': {
            deep: true,
            handler: watchFuc
        },
        'arrayTest': {
            handler: watchFuc
        }
    },*/
    /*computed: {
        computedTest() {
            return this.baseTest
        }
    },*/
    /*props: {
        propsTest: {
            type: Object,
            default() {
                return props
            }
        }
    },
    propsData: {
        // propsTest: false
    },*/
    methods: {
        methodsTest() {
            console.log('methodsTest')
            setTimeout(() => {
                this.$emit('eventTest')
            }, 1000)
        },
        returnTest() {
            console.log('parent Listen')
            return this.baseTest
        }
    },
    /*render() {
        console.log('template')
        return temFun(this)
    },*/
    components: {
        'com-test': {
            name: 'com-test',
            data() {
                return {
                    comData: 1
                }
            },
            methods:{
                test(){
                    this.$emit('testEvent')
                }
            }
        }
    }
})

/**
 * 模拟父子组件通信
 */
// 模拟子组件实例化
vm.$options.components["com-test"].parent = vm

// 模拟父组件添加事件监听
vm.$options.components["com-test"]._parentListeners = {
    testEvent() {
        vm.returnTest()
    }
}

let chlidCtor = vm.$options._base.extend(vm.$options.components["com-test"])
let childVm = new chlidCtor()

childVm.test()


/*new Watcher(vm, () => {
    this._data
    this._props
}, () => {
    vm.$options.render.call(vm)
}, {
    deep: true
}, true)*/

// vm.baseTest = 2

// props.propsA = 2
