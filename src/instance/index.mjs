import {stateMixin} from "./state";
import {initMixin} from "./init";
import {eventsMixin} from "./events";

function Vue(options) {
    this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)

export default Vue