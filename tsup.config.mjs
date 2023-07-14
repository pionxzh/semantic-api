import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/semantic-api.ts'],
    format: ['cjs', 'esm'],
    target: 'es6',
    minify: 'terser',
    sourcemap: true,
    clean: true,
})
