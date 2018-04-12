let Dep = function () {

    this.subs = []

    this.addSub = function (sub) {
        this.subs.push(sub)
    }

    this.removeSub = function (sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }

    this.notify = function () {
        // 修改触发方法
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null


let defineReactive = function (object, key, value) {
    let dep = new Dep()
    Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target)
                // 添加 watcher 对 dep 的引用
                Dep.target.addDep(dep)
            }
            return value
        },
        set: function (newValue) {
            if (newValue != value) {
                value = newValue
                dep.notify()
            }
        }
    })
}


let Watcher = function (object, getter, callback) {
    this.obj = object
    this.getter = getter
    this.cb = callback
    this.dep = []
    this.value = undefined

    this.get = function () {
        Dep.target = this
        let value = this.getter.call(object)
        Dep.target = null
        return value
    }

    this.update = function () {
        const value = this.getter.call(object)
        const oldValue = this.value
        this.value = value
        this.cb.call(this.obj, value, oldValue)
    }

    this.addDep = function (dep) {
        this.dep.push(dep)
    }

    this.teardown = function () {
        let i = this.deps.length
        while (i--) {
            this.deps[i].removeSub(this)
        }
        this.deps = []
    }

    this.value = this.get()
}


let object = {}
defineReactive(object, 'num1', 2)
defineReactive(object, 'num2', 4)

let watcher = new Watcher(object, function () {
    return this.num1 + this.num2
}, function (newValue, oldValue) {
    console.log('这是一个监听函数，函数的新值为：' + newValue)
})

object.num1 = 3
// 这是一个监听函数，函数的新值为：7
object.num2 = 10
// 这是一个监听函数，函数的新值为：13
