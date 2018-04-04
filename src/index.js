import Vue from "./instance/index"
import {initGlobalApi} from "./global-api";

initGlobalApi(Vue)

Vue.__VERSION__ = '0.0.1'

export default Vue