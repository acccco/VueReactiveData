import {stateMixin} from "./state";
import {initMixin} from "./init";

function Vue(options) {
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)

export default Vue