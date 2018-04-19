import {noop, extend} from '../util/normal-util'

// type CompiledFunctionResult = {
//   render: Function;
//   staticRenderFns: Array<Function>;
// };

function createFunction(code, errors) {
    try {
        return new Function(code)
    } catch (err) {
        errors.push({err, code})
        return noop
    }
}

let baseWarn = function (msg) {
    console.log(msg)
}

export function createCompileToFunctionFn(compile) {
    const cache = Object.create(null)

    // CompiledFunctionResult
    return function compileToFunctions(template, options, vm) {
        options = extend({}, options)
        const warn = options.warn || baseWarn
        delete options.warn

        try {
            new Function('return 1')
        } catch (e) {
            if (e.toString().match(/unsafe-eval|CSP/)) {
                warn(
                    'It seems you are using the standalone build of Vue.js in an ' +
                    'environment with Content Security Policy that prohibits unsafe-eval. ' +
                    'The template compiler cannot work in this environment. Consider ' +
                    'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                    'templates into render functions.'
                )
            }
        }

        // check cache
        const key = options.delimiters
            ? String(options.delimiters) + template
            : template
        if (cache[key]) {
            return cache[key]
        }

        // compile
        const compiled = compile(template, options)

        if (compiled.errors && compiled.errors.length) {
            warn(
                `Error compiling template:\n\n${template}\n\n` +
                compiled.errors.map(e => `- ${e}`).join('\n') + '\n'
            )
        }
        if (compiled.tips && compiled.tips.length) {
            compiled.tips.forEach(msg => baseWarn(msg, vm))
        }

        // turn code into functions
        const res = {}
        const fnGenErrors = []
        res.render = createFunction(compiled.render, fnGenErrors)
        res.staticRenderFns = compiled.staticRenderFns.map(code => {
            return createFunction(code, fnGenErrors)
        })

        // check function generation errors.
        // this should only happen if there is a bug in the compiler itself.
        // mostly for codegen development use
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
            warn(
                `Failed to generate render function:\n\n` +
                fnGenErrors.map(({err, code}) => `${err.toString()} in\n\n${code}\n`).join('\n')
            )
        }

        return (cache[key] = res)
    }
}
