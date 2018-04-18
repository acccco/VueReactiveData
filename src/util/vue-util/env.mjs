// 判断是否能使用 __proto__ 对象
export const hasProto = '__proto__' in {}

export const nativeWatch = ({}).watch

export function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)