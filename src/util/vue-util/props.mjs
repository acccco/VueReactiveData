/*type PropOptions = {
    type: Function | Array<Function> | null,
    default: any,
    required: ?boolean,
    validator: ?Function
};*/

import {hasOwn, hyphenate} from "../normal-util";
import {observe, observerState} from "../../observe/index";

// 获取 prop 中 key 对应的值
export function validateProp (key, propOptions, propsData, vm) {
    const prop = propOptions[key]
    const absent = !hasOwn(propsData, key)
    // propsData 为父组件传进来的 props 实际数据的集合
    let value = propsData[key]
    // 处理 type 为 Boolean 的情况
    if (isType(Boolean, prop.type)) {
        if (absent && !hasOwn(prop, 'default')) {
            value = false
        } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
            value = true
        }
    }
    // 获取到默认值
    if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key)
        // TODO 为什么要监听，有待确认，因为既然取了默认值
        // TODO 那么父组件就没有传入值，而且 props 在子组件是禁止修改的，所以默认值永远不会变，监听也不会触发
        // TODO 有待确认
        const prevShouldConvert = observerState.shouldConvert
        observerState.shouldConvert = true
        observe(value)
        observerState.shouldConvert = prevShouldConvert
    }
    return value
}

/**
 * 获取到默认值
 */
function getPropDefaultValue (vm, prop, key) {
    // 如果没有 default 则返回 undefined
    if (!hasOwn(prop, 'default')) {
        return undefined
    }
    const def = prop.default

    // 为 def 做兼容处理，一般上不应该返回，但得排除 type: Function 的情况
    return typeof def === 'function' && getType(prop.type) !== 'Function'
        ? def.call(vm)
        : def
}

/**
 * 获取到函数的类型 e.g. Boolean => 'Boolean'
 */
function getType (fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
}

function isType (type, fn) {
    if (!Array.isArray(fn)) {
        return getType(fn) === getType(type)
    }
    for (let i = 0, len = fn.length; i < len; i++) {
        if (getType(fn[i]) === getType(type)) {
            return true
        }
    }
    return false
}
