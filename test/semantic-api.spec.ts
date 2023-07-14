import { describe, expect, it } from 'vitest'
import SemanticApi from '../src/semantic-api'
import type { SemanticCustomMethods } from '../src/semantic-api'

describe('# Single function', () => {
    const semantic = () => SemanticApi()

    it('should return empty string', () => {
        const result = semantic().toString()
        expect(result).to.equal('')
    })
    it('should return property name', () => {
        const result = semantic().test.toString()
        expect(result).to.equal('test')
    })
    it('should return method name', () => {
        const result = semantic().test().toString()
        expect(result).to.equal('test')
    })
    it('should return "query"', () => {
        const result = semantic().query().toString()
        expect(result).to.equal('query')
    })
    it('should return queryString', () => {
        const result = semantic().query({ number: 1, string: 'test', bool: false }).toString()
        expect(result).to.equal('?number=1&string=test&bool=false')
    })
})

describe('# Without baseUrl', () => {
    const semantic = () => SemanticApi()

    it('should return property chain', () => {
        const result = semantic().api.music.info.toString()
        expect(result).to.equal('api/music/info')
    })
    it('should return method chain', () => {
        const result = semantic().test().this(5).to().have().fun().toString()
        expect(result).to.equal('test/this/5/to/have/fun')
    })
    it('should return mixed property/method chain', () => {
        const result = semantic().try().again.to().ensure().toString()
        expect(result).to.equal('try/again/to/ensure')
    })
    it('should return mixed property and method name and query', () => {
        const result = semantic().try(123).again.to('456').ensure().query({ test: 1, again: false }).toString()
        expect(result).to.equal('try/123/again/to/456/ensure?test=1&again=false')
    })
})

describe('# With baseUrl', () => {
    const semantic = () => SemanticApi('https://example.com/')

    it('should return baseUrl only', () => {
        const result = semantic().toString()
        expect(result).to.equal('https://example.com/')
    })
    it('should return property chain with baseUrl', () => {
        const result = semantic().user.id.toString()
        expect(result).to.equal('https://example.com/user/id')
    })
    it('should return method chain', () => {
        const result = semantic().test().this(5).to().have().fun().toString()
        expect(result).to.equal('https://example.com/test/this/5/to/have/fun')
    })
    it('should return mixed property/method chain with baseUrl', () => {
        const result = semantic().user.id(9527).edit().toString()
        expect(result).to.equal('https://example.com/user/id/9527/edit')
    })
    it('should return mixed property/method chain and query with baseUrl', () => {
        const result = semantic().try(123).again.to('456').ensure().query({ test: 1, again: false }).toString()
        expect(result).to.equal('https://example.com/try/123/again/to/456/ensure?test=1&again=false')
    })
})

describe('# String operate', () => {
    const semantic = () => SemanticApi()

    it('should act as string concat', () => {
        const a = semantic().try(123).to
        const b = semantic().Test.again(456)
        const result = a + b
        expect(result).to.equal('try/123/toTest/again/456')
    })
})

describe('# Custom functions', () => {
    it('should return anotherFunc instead of func', () => {
        const customFunc: SemanticCustomMethods = {
            func: (args, calls) => {
                calls.push('anotherFunc')
            },
        }
        const semanticWithFunc = () => SemanticApi('', customFunc)
        const result = semanticWithFunc().try.to.call.func().test.toString()
        expect(result).to.equal('try/to/call/anotherFunc/test')
    })

    it('simulate original behavior when there is data input', () => {
        const customFunc: SemanticCustomMethods = {
            func: (args, calls) => {
                const data = args.shift()
                data ? calls.push('func', data, ...args) : calls.push('anotherFunc')
            },
        }
        const semanticWithFunc = () => SemanticApi('', customFunc)
        const result1 = semanticWithFunc().try.to.call.func(123, '456').test.toString()
        expect(result1).to.equal('try/to/call/func/123/456/test')

        const result2 = semanticWithFunc().try.to.call.func().test.toString()
        expect(result2).to.equal('try/to/call/anotherFunc/test')
    })

    it('should return the result when customFunc return', () => {
        const customFunc: SemanticCustomMethods = {
            func: (args, calls, url) => {
                return url.split('')
            },
        }
        const semanticWithFunc = () => SemanticApi('', customFunc)
        const result = semanticWithFunc().try.to.func()
        expect(result).to.deep.equal(['t', 'r', 'y', '/', 't', 'o'])
    })
})
