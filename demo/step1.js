let callback = {
    target: null
}
let defineReactive = function(object, key, value){
    let array = []
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function(){
            if(callback.target){
                array.push(callback.target)
            }
            return value
        },
        set: function(newValue){
            if(newValue != value){
                array.forEach((fun)=>fun(newValue, value))
            }
            value = newValue
        }
    })
}

let object = {}
defineReactive(object, 'test', 'test')
callback.target = function(newValue, oldValue){console.log('我被添加进去了，新的值是：' + newValue)}
object.test
// test
callback.target = null
object.test = 'test2'
// 我被添加进去了，新的值是：test2
callback.target = function(newValue, oldValue){console.log('添加第二个函数，新的值是：' + newValue)}
object.test
// test
callback.target = null
object.test = 'test3'
// 我被添加进去了，新的值是：test3
// 添加第二个函数，新的值是：test3
