import {Vue} from './Vue.mjs'
import Watcher from '../util/Watcher'

let test = new Vue({
    data() {
        return {
            dataTest: {
                subTest: 1
            }
        }
    },
    components: {
        sub: {
            props: {
                propsStaticTest: {
                    default: 'propsStaticTestDefault'
                },
                propsDynamicTest: {
                    default: 'propsDynamicTestDefault'
                }
            },
            watch: {
                'propsDynamicTest'(newValue, oldValue) {
                    console.log('propsDynamicTest newValue = ' + newValue)
                }
            }
        }
    }
})

let options = test.$options.components.sub
options.parent = test

// 假设这是模板解析出来的数据
// 比如模板是这样 <sub propsStaticTest="propsStaticValue" :propsDynamicTest="dataTest.subTest"></sub>
// 在 vue 中使用 :/v-bind 就是动态绑定
let propsOption = [{
    key: 'propsStaticTest',
    value: 'propsStaticValue',
    isDynamic: false
}, {
    key: 'propsDynamicTest',
    value: 'dataTest.subTest',
    isDynamic: true
}]

let propsData = {}
propsOption.forEach(item => {
    if (item.isDynamic) {
        propsData[item.key] = item.value.split('.').reduce((obj, name) => obj[name], test)
    } else {
        propsData[item.key] = item.value
    }
})

// props 数据是动态所以应该是生成实例的时候传入，而配置是静态的所以应该是扩展的时候传入
let testComSub = new (Vue.extend(options))({propsData})

// 添加监听，将父组件的变化映射到子组件中
propsOption.forEach(item => {
    if (item.isDynamic) {
        new Watcher(test, () => {
            return item.value.split('.').reduce((obj, name) => obj[name], test)
        }, (newValue, oldValue) => {
            testComSub[item.key] = newValue
        })
    }
})

console.log(testComSub.propsStaticTest)
console.log(testComSub.propsDynamicTest)

test.dataTest.subTest = 2

console.log(testComSub.propsDynamicTest)

