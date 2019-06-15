# Semantic Api
[![npm](https://img.shields.io/npm/v/semantic-api.svg)](https://www.npmjs.com/package/semantic-api)
[![Build Status](https://travis-ci.org/pionxzh/semantic-api.svg?branch=master)](https://travis-ci.org/pionxzh/semantic-api)
[![Coverage Status](https://coveralls.io/repos/github/pionxzh/semantic-api/badge.svg?branch=master)](https://coveralls.io/github/pionxzh/semantic-api?branch=master)
![David](https://img.shields.io/david/pionxzh/semantic-api.svg?color=%23009688)
[![Bundle](https://img.shields.io/bundlephobia/minzip/semantic-api.svg)](https://bundlephobia.com/result?p=semantic-api)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

🎏 SemanticApi是一个可以帮助你简洁有力的宣告 URL 以及更好地使用 API的工具。( <1kb )

[English](/README.md)

[CanIUse]: https://caniuse.com/#search=proxy

## 目录
  - [什么是 Semantic Api](#%E4%BB%80%E4%B9%88%E6%98%AF-semantic-api)
  - [安装指南](#%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)
  - [开始使用](#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8)
  - [用例](#%E7%94%A8%E4%BE%8B)
    - [Bind function](#bind-function)
  - [API](#api)
  - [特别感谢](#%E7%89%B9%E5%88%AB%E6%84%9F%E8%B0%A2)
  - [License](#license)

## 什么是 Semantic Api

还记得我们是怎么跟各种API网址斗智斗勇的吗? 从最初的 字串拼接 到ES6的 模板字串，抽出去到`config.json`也好，放一些特殊字串如`%ID%`然后再`replace`等等的方法...

![ojbk](https://i.imgur.com/4obQkNn.jpg)

SemanticApi提供一个简洁有力的方法来宣告 URL 与使用 API，下面举几个对比栗子。

```js
const baseUrl = 'https://api.example.com/'
const options = { page: 2 }

const ex1 = baseUrl + "v4/user/" + UserID + "/filter?page=" + options.page

const ex2 = `${baseUrl}v4/user/${UserID}/filter?page=${options.page}`
// ====================================================================
const ex3 = SemanticApi(baseUrl).v4.user(UserID).filter.query(options)
// ====================================================================

// => https://api.example.com/v4/user/9527/filter?page=2
```

## 安装指南

SemanticApi 支援 `Node.js` `8.0`以上，以及Chrome/FF/Safari (NO IE)的最新版本。\
由于利用了ES6 [Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的特性 ( [CanIUse][CanIUse] )，目前没有任何可行的降级/Polyfill方案 (未来应该也不会有)

### Node.js
* `Node.js` >= 8.0

```bash
npm install semantic-api --save
```
### 浏览器

* 从 [/dist](https://github/pionxzh/semantic-api/dist/) 下载打包好的档案

## 开始使用

```js
const SemanticApi = require('semantic-api')

console.log(SemanticApi().try.to.test.api)
// => "try/to/test/api"

console.log(SemanticApi('/').user.id(9527).profile)
// => "/user/id/9527/profile"
```

建议在SemanticApi外多封装一层以便清晰的表达其意图。

```js
const SemanticApi = require('semantic-api')

const API = {
    get spotify () {
        return SemanticApi('https://api.spotify.com/')
    }
}

API.spotify.music.category(7).filter.query({ premium: true })
// => https://api.spotify.com/music/category/7/filter?premium=true
```

## 用例

### Bind function

你可以绑定一些像是 `fetch`, [axios](https://github.com/axios/axios) 等HTTP库来实现更方便的链式调用。

```js
import SemanticApi from 'semantic-api'

class Instgram {
    static get api () {
        const baseUrl = 'https://api.instagram.com/'
        const customFn = {
            get: function (args, calls, url) { ... },
            post: function (args, calls, url) {
                return fetch(url, args.shift(), { method: 'post', ... })
            }
        }
        return SemanticApi(baseUrl, customFn)
    }

    static login (data) {
        const options = { client_id: 'CLIENT-ID', redirect_uri: 'REDIRECT-URI' }
        Instgram.api.oauth.authorize.query(options).post(data)
            .then(...)
    }
}

Instgram.login(...)
// POST https://api.instagram.com/oauth/authorize?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI
```

## API

### SemanticApi(baseUrl?, customMethods?)

#### baseUrl
类型: `string`\
预设值: `""`

#### customMethods
类型: `object`\
预设值: `{}`

几颗栗子:
```js
SemanticApi().api.user(9527).test.fnName(123, '456')
```

```js
customMethods = {
    fnName: function (args, calls, url) {
        // args 是一个参数array. Ex: [123, '456']
        // calls 是前面chaining call的纪录. Ex: ['api', 'user', 9527, 'test']
        // url 是当前组合完成的Url. Ex: 'api/user/9527/test'

        // 可以与calls进行互动，push() pop()都会应用到semanticAPI内部
        calls.push('anotherFnName')

        // `return` 会立刻停止链式调用并返回该值
        return fetch(url, options)
    }
}
```

### .query(data)
类型: `object`

**注意**: `data` 不接受Nested object，仅能处理一般的单层object.\
如有需要，随时可以透过 `customMethods` 来override旧有方法.

```js
const obj = { name: 'bob', age: 16, test: true }
SemanticApi().query(obj)
// => ?name=bob&age=16&test=true

```

## 特别感谢

* Inspired by [Discord.js](https://github.com/discordjs/discord.js)

## License
[MIT](LICENSE)
