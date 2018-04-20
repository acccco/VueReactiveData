let uid = 0

export default class Dep {

    constructor() {
        this.id = ++uid
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub)
        if (index > -1) {
            this.subs.splice(index, 1)
        }
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null

