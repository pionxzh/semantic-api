'use strict'
const expect = require('chai').expect
const SemanticApi = require('../lib/semantic-api')

describe('SemanticApi: Single function', () => {
    let semantic = () => new SemanticApi()

    it('should return empty string', () => {
        let result = semantic().toString()
        expect(result).to.equal('')
    })
    it('should return property name', () => {
        let result = semantic().test.toString()
        expect(result).to.equal('test')
    })
    it('should return method name', () => {
        let result = semantic().test().toString()
        expect(result).to.equal('test')
    })
    it('should return "query"', () => {
        let result = semantic().query().toString()
        expect(result).to.equal('query')
    })
    it('should return queryString', () => {
        let result = semantic().query({ number: 1, string: 'test', bool: false }).toString()
        expect(result).to.equal('?number=1&string=test&bool=false')
    })
})

describe('SemanticApi: Default', () => {
    let semantic = () => new SemanticApi()

    it('should return property chain', () => {
        let result = semantic().api.music.info.toString()
        expect(result).to.equal('api/music/info')
    })
    it('should return method chain', () => {
        let result = semantic().test().this(5).to().have().fun().toString()
        expect(result).to.equal('test/this/5/to/have/fun')
    })
    it('should return mixed property/method chain', () => {
        let result = semantic().try().again.to().ensure().toString()
        expect(result).to.equal('try/again/to/ensure')
    })
    it('should return mixed property and method name and query', () => {
        let result = semantic().try(123).again.to('456').ensure().query({ test: 1, right: false }).toString()
        expect(result).to.equal('try/123/again/to/456/ensure?test=1&right=false')
    })
})

describe('SemanticApi: With baseUrl', () => {
    let semantic = () => new SemanticApi('https://example.com/')

    it('should return baseUrl only', () => {
        let result = semantic().toString()
        expect(result).to.equal('https://example.com/')
    })
    it('should return property chain with baseUrl', () => {
        let result = semantic().user.id.toString()
        expect(result).to.equal('https://example.com/user/id')
    })
    it('should return method chain', () => {
        let result = semantic().test().this(5).to().have().fun().toString()
        expect(result).to.equal('https://example.com/test/this/5/to/have/fun')
    })
    it('should return mixed property/method chain with baseUrl', () => {
        let result = semantic().user.id(9527).edit().toString()
        expect(result).to.equal('https://example.com/user/id/9527/edit')
    })
    it('should return mixed property/method chain and query with baseUrl', () => {
        let result = semantic().try(123).again.to('456').ensure().query({ test: 1, right: false }).toString()
        expect(result).to.equal('https://example.com/try/123/again/to/456/ensure?test=1&right=false')
    })
})
