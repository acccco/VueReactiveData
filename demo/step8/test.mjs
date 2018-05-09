import {Event} from "./Event";

let eventTest = new Event()

eventTest.$on('eventName1', (e) => {
    console.log('一次添加一个处理函数')
    console.log(e)
})

eventTest.$on('eventName2', [(e) => {
    console.log('一次添加多个处理函数，第一个')
    console.log(e)
}, (e) => {
    console.log('一次添加多个处理函数，第二个')
    console.log(e)
}])

eventTest.$on(['eventName3', 'eventName4'], (e) => {
    console.log('多个事件添加同一处理函数')
    console.log(e)
})

eventTest.$on(['eventName5', 'eventName6'], [(e) => {
    console.log('多个事件添加多个处理函数，第一个')
    console.log(e)
}, (e) => {
    console.log('多个事件添加多个处理函数，第二个')
    console.log(e)
}])

eventTest.$emit('eventName1', '传入参数1')
// 一次添加一个处理函数
// 传入参数1
eventTest.$emit('eventName2', '传入参数2')
// 一次添加多个处理函数，第一个
// 传入参数2
// 一次添加多个处理函数，第二个
// 传入参数2
eventTest.$emit('eventName3', '传入参数3')
// 多个事件添加同一处理函数
// 传入参数3
eventTest.$emit('eventName4', '传入参数4')
// 多个事件添加同一处理函数
// 传入参数4
eventTest.$emit('eventName5', '传入参数5')
// 多个事件添加多个处理函数，第一个
// 传入参数5
// 多个事件添加多个处理函数，第二个
// 传入参数5
eventTest.$emit('eventName6', '传入参数6')
// 多个事件添加多个处理函数，第一个
// 传入参数6
// 多个事件添加多个处理函数，第二个
// 传入参数6
console.log('------------------------------')

eventTest.$off('eventName1')
eventTest.$off(['eventName2', 'eventName3'])

eventTest.$emit('eventName1', '传入参数1')
// 无输出
eventTest.$emit('eventName2', '传入参数2')
// 无输出
eventTest.$emit('eventName3', '传入参数3')
// 无输出
eventTest.$emit('eventName4', '传入参数4')
// 多个事件添加同一处理函数
// 传入参数4
eventTest.$emit('eventName5', '传入参数5')
// 多个事件添加多个处理函数，第一个
// 传入参数5
// 多个事件添加多个处理函数，第二个
// 传入参数5
eventTest.$emit('eventName6', '传入参数6')
// 多个事件添加多个处理函数，第一个
// 传入参数6
// 多个事件添加多个处理函数，第二个
// 传入参数6
console.log('------------------------------')

eventTest.$off()
eventTest.$emit('eventName1', '传入参数1')
// 无输出
eventTest.$emit('eventName2', '传入参数2')
// 无输出
eventTest.$emit('eventName3', '传入参数3')
// 无输出
eventTest.$emit('eventName4', '传入参数4')
// 无输出
eventTest.$emit('eventName5', '传入参数5')
// 无输出
eventTest.$emit('eventName6', '传入参数6')
// 无输出
console.log('------------------------------')

let fn = (e) => {
    console.log(e)
}
eventTest.$on('eventName7', fn)
eventTest.$on('eventName7', (e) => {
    console.log(e)
})
eventTest.$off('eventName7', fn)
eventTest.$emit('eventName7', '测试取消')