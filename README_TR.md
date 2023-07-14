# Semantic Api
[![npm](https://img.shields.io/npm/v/semantic-api.svg)](https://www.npmjs.com/package/semantic-api)
[![Coverage Status](https://coveralls.io/repos/github/pionxzh/semantic-api/badge.svg?branch=master)](https://coveralls.io/github/pionxzh/semantic-api?branch=master)
[![Bundle](https://img.shields.io/bundlephobia/minzip/semantic-api.svg)](https://bundlephobia.com/result?p=semantic-api)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

🎏 SemanticApi是一個可以幫助你簡潔有力的宣告 URL 以及更好地使用 API的工具。( <1kb )

[English](/README.md)

[CanIUse]: https://caniuse.com/#search=proxy

## 目錄
  - [什麼是 Semantic Api](#%E4%BB%80%E9%BA%BC%E6%98%AF-semantic-api)
  - [安裝指南](#%E5%AE%89%E8%A3%9D%E6%8C%87%E5%8D%97)
  - [開始使用](#%E9%96%8B%E5%A7%8B%E4%BD%BF%E7%94%A8)
  - [用例](#%E7%94%A8%E4%BE%8B)
    - [Bind function](#bind-function)
  - [API](#api)
  - [特別感謝](#%E7%89%B9%E5%88%A5%E6%84%9F%E8%AC%9D)
  - [License](#license)

## 什麼是 Semantic Api

還記得我們是怎麼跟各種API網址鬥智鬥勇的嗎? 從最初的 字串拼接 到ES6的 模板字串，抽出去到`config.json`也好，放一些特殊字串如`%ID%`然後再`replace`等等的方法...

![ojbk](https://i.imgur.com/4obQkNn.jpg)

SemanticApi提供一個簡潔有力的方法來宣告 URL 與使用 API，下面舉幾個對比栗子。

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

## 安裝指南

SemanticApi 支援 `Node.js` `8.0`以上，以及Chrome/FF/Safari (NO IE)的最新版本。\
由於利用了ES6 [Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的特性 ( [CanIUse][CanIUse] )，目前沒有任何可行的降級/Polyfill方案 (未來應該也不會有)

### Node.js
* `Node.js` >= 8.0

```bash
npm install semantic-api --save
```
### 瀏覽器

* 從 [/dist](https://github/pionxzh/semantic-api/dist/) 下載打包好的檔案

## 開始使用

```js
import SemanticApi from 'semantic-api'

console.log(SemanticApi().try.to.test.api)
// => "try/to/test/api"

console.log(SemanticApi('/').user.id(9527).profile)
// => "/user/id/9527/profile"
```

建議在 SemanticApi 外多封裝一層以便清晰的表達其意圖。

```js
import SemanticApi from 'semantic-api'

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

你可以綁定一些像是 `fetch`, [axios](https://github.com/axios/axios) 等HTTP庫來實現更方便的鍊式調用。

```js
import SemanticApi from 'semantic-api'

class Instagram {
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
        Instagram.api.oauth.authorize.query(options).post(data)
            .then(...)
    }
}

Instagram.login(...)
// POST https://api.instagram.com/oauth/authorize?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI
```

## API

### SemanticApi(baseUrl?, customMethods?)

#### baseUrl
類型: `string`\
預設值: `""`

#### customMethods
類型: `object`\
預設值: `{}`

幾顆栗子:
```js
SemanticApi().api.user(9527).test.fnName(123, '456')
```

```js
customMethods = {
    fnName: function (args, calls, url) {
        // args 是一個參數array. Ex: [123, '456']
        // calls 是前面chaining call的紀錄. Ex: ['api', 'user', 9527, 'test']
        // url 是當前組合完成的Url. Ex: 'api/user/9527/test'

        // 可以與calls進行互動，push() pop()都會應用到semanticAPI內部
        calls.push('anotherFnName')

        // `return` 會立刻停止鍊式調用並返回該值
        return fetch(url, options)
    }
}
```

### .query(data)
類型: `object`

**注意**: `data` 不接受Nested object，僅能處理一般的單層object.\
如有需要，隨時可以透過 `customMethods` 來override舊有方法.

```js
const obj = { name: 'bob', age: 16, test: true }
SemanticApi().query(obj)
// => ?name=bob&age=16&test=true
```

## 特別感謝

* Inspired by [Discord.js](https://github.com/discordjs/discord.js)

## License
[MIT](LICENSE)
