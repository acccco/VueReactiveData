// // 文字解释：http://blog.acohome.cn/2018/04/11/vue-dep/

let Dep = function(){

    // 实例属性
    this.subs = []

    // 实例方法
    this.addSub = function(sub){
        this.subs.push(sub)
    }

    this.removeSub = function(sub){
        const index = this.subs.indexOf(item)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }

    this.notify = function(newValue, oldValue){
        this.subs.forEach(fnc=>fnc(newValue, oldValue))
    }
}

// 类属性
Dep.target = null

let defineReactive = function(object, key, value){
    let dep = new Dep()
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function(){
            if(Dep.target){
                dep.addSub(Dep.target)
            }
            return value
        },
        set: function(newValue){
            if(newValue != value){
                dep.notify(newValue, value)
            }
            value = newValue
        }
    })
}

let object = {}
defineReactive(object, 'test', 'test')
Dep.target = function(newValue, oldValue){console.log('我被添加进去了，新的值是：' + newValue)}
object.test
// test
Dep.target = null
object.test = 'test2'
// 我被添加进去了，新的值是：test2
Dep.target = function(newValue, oldValue){console.log('添加第二个函数，新的值是：' + newValue)}
object.test
// test
Dep.target = null
object.test = 'test3'
// 我被添加进去了，新的值是：test3
// 添加第二个函数，新的值是：test3