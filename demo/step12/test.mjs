import {Vue} from './Vue.mjs'

let test = new Vue({
    data() {
        return {
            dataTest: 1
        }
    },
    methods: {
        methodTest() {
            console.log('methodTest')
        }
    },
    watch: {
        'dataTest'(newValue, oldValue) {
            console.log('watchTest newValue = ' + newValue)
        }
    },
    computed: {
        'computedTest': {
            get() {
                return this.dataTest + 1
            }
        }
    },
    components: {
        sub: {
            data() {
                return {
                    subData: 11
                }
            },
            methods: {
                subMethod() {
                    console.log('subMethodTest')
                }
            },
            watch: {
                'subData'(newValue, oldValue) {
                    console.log('subWatch newValue = ' + newValue)
                }
            },
            computed: {
                'subComputed': {
                    get() {
                        return this.subData + 1
                    }
                }
            }
        }
    }
})