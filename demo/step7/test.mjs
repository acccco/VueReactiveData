import {Event} from "./Event";

let eventTest = new Event()

eventTest.$on('testEvent', function (event) {
    console.log('测试事件添加，传入参数为' + event)
})

eventTest.$emit('testEvent', '事件触发成功')

eventTest.$emit('testEvent', '事件再次触发成功')

eventTest.$off('testEvent')

eventTest.$emit('testEvent', '事件取消，不会有输出')

eventTest.$once('testOnce', function (event) {
    console.log('事件仅仅触发一次，传入参数为' + event)
})

eventTest.$emit('testOnce', '事件触发成功')

eventTest.$emit('testOnce', '事件取消，不会有输出')