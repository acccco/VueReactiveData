import { compile, compileToFunctions } from '../src/platforms/web/compiler/index'

let astTemp = compile(`
<div :props="props" :class="{on:classFlag}" class="aaa" @click="click" @tap="tap">
    <h1>h1123123123</h1>
    <h2>{{h2}}</h2>
    <input type="text" v-model="model">
</div>
`)
console.log(astTemp.render)

console.log(astTemp.ast.children)