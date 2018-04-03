import Vue from "./instance/index"
import { initGlobalAPI } from "./global-api/index"

initGlobalAPI(Vue)

Vue.__VERSION__ = '0.0.1'

export default Vue