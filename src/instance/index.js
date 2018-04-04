import {initState, stateMixin} from "./state";

function Vue(options) {
    this._init(options)
}

initState(Vue)
stateMixin(Vue)

export default Vue