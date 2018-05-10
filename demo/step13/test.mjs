import {Vue} from './Vue.mjs'

let test = new Vue({
    provide: {
        foo: 'bar'
    },
    components: {
        sub: {
            inject: {
                foo: {default: 'foo'},
                bar: {default: 'subBar'}
            },
            components: {
                subSub: {
                    inject: {
                        foo: {default: 'foo'},
                        bar: {default: 'subSubBar'}
                    }
                }
            }
        }
    }
})

let testSubClass = Vue.extend(test.$options.components.sub)
let testSub = new testSubClass({parent: test})

let testSubSubClass = Vue.extend(testSub.$options.components.subSub)
let testSubSub = new testSubSubClass({parent: testSub})

console.log(testSub.foo)
// bar
console.log(testSub.bar)
// subBar
console.log(testSubSub.foo)
// bar
console.log(testSubSub.bar)
// subSubBar

