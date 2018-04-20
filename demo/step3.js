// 文字解释：http://blog.acohome.cn/2018/04/12/vue-watcher/

let Dep = function(){

    this.subs = []

    this.addSub = function(sub){
        this.subs.push(sub)
    }

    this.removeSub = function(sub){
        const index = this.subs.indexOf(sub)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }

    this.notify = function(){
        // 修改触发方法
        this.subs.forEach(watcher=>watcher.update())
    }
}

Dep.target = null

let defineReactive = function(object, key, value){
    let dep = new Dep()
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function(){
            if(Dep.target){
                dep.addSub(Dep.target)
                // 添加 watcher 对 dep 的引用
                Dep.target.addDep(dep)
            }
            return value
        },
        set: function(newValue){
            if(newValue != value){
                value = newValue
                dep.notify()
            }
        }
    })
}

let Watcher = function(object, key, callback){
    this.obj = object
    this.getter = key
    this.cb = callback
    this.dep = null
    this.value = undefined

    this.get = function(){
        Dep.target = this
        let value = this.obj[this.getter]
        Dep.target = null
        return value
    }

    this.update = function(){
        const value = this.obj[this.getter]
        const oldValue = this.value
        this.value = value
        this.cb.call(this.obj, value, oldValue)
    }

    this.addDep = function(dep) {
        this.dep = dep
    }

    this.value = this.get()
}

let object = {}
defineReactive(object, 'test', 'test')

let watcher = new Watcher(object, 'test', function(newValue, oldValue){
    console.log('作为 watcher 添加的第一个函数，很自豪。新值：' + newValue)
})
object.test = 'test2'
// 作为 watcher 添加的第一个函数，很自豪。新值：test2

let watcher2 = new Watcher(object, 'test', function(newValue, oldValue){
    console.log('作为 watcher 添加的第二个函数，也很自豪。新值：' + newValue)
})
object.test = 'test3'
// 作为 watcher 添加的第一个函数，很自豪。新值：test3
// 作为 watcher 添加的第二个函数，也很自豪。新值：test3

// 接着我们来试一下删除依赖，把 watcher2 给删除
watcher2.dep.removeSub(watcher2)
object.test = 'test4'
