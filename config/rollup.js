import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'

const output = {
    name: 'semantic-api',
    format: 'umd'
}

const extensions = ['.ts', '.js']

const plugins = [
    resolve({
        extensions
    }),
    babel({
        extensions,
        babelrc: false,
        ...require('./babel.config')()
    })
]

export default [{
    input: 'src/semantic-api.ts',
    output: {
        file: 'dist/semantic-api.js',
        ...output
    },
    plugins
}, {
    input: 'src/semantic-api.ts',
    output: {
        file: 'dist/semantic-api.min.js',
        ...output
    },
    plugins: [
        ...plugins,
        terser()
    ]
}]
