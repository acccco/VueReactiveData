import { compile, compileToFunctions } from '../src/platforms/web/compiler/index'

let astTemp = compile(`
<div :props="props" :class="{on:classFlag}" @click="click" @tap="tap">
    <h1>h1</h1>
</div>
`)

console.log(astTemp)

console.log(astTemp.ast.children)