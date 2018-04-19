export default function on(el, dir) {
    console.log(`v-on without argument does not support modifiers.`)
    el.wrapListeners = (code) => `_g(${code},${dir.value})`
}
