function watchFuc(newValue, oldValue) {
    console.log(newValue, oldValue)
}

var vm = new Vue({
    data: function () {
        return {
            baseTest: 1,
            objectTest: {
                value1: 1,
                value2: 2
            }
        }
    },
    // watch 测试
    watch: {
        'baseTest': watchFuc,
        'objectTest': {
            deep: true,
            handler: watchFuc
        }
    },
    computed: {
        'computedTest': function () {
            return this.baseTest
        }
    }
})

window.vm = vm
console.log(vm)
