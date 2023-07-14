# Semantic Api
[![npm](https://img.shields.io/npm/v/semantic-api.svg)](https://www.npmjs.com/package/semantic-api)
[![Coverage Status](https://coveralls.io/repos/github/pionxzh/semantic-api/badge.svg?branch=master)](https://coveralls.io/github/pionxzh/semantic-api?branch=master)
[![Bundle](https://img.shields.io/bundlephobia/minzip/semantic-api.svg)](https://bundlephobia.com/result?p=semantic-api)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

🎏 SemanticApi provides a powerful way to declare and interact with the API url. ( <1kb )

[繁體中文](/README_TR.md) | [簡體中文](/README_SC.md)

[CanIUse]: https://caniuse.com/#search=proxy

## Table of Contents
  - [What is Semantic Api](#what-is-semantic-api)
  - [Install](#install)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
    - [Bind function](#bind-function)
  - [API](#api)
  - [Credits](#credits)
  - [License](#license)

## What is Semantic Api

Still remember how people hard-code the url or use es6 `template literal` to interpolate the variable in ?

SemanticApi provides a powerful way to declare and interact with the API Url.

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

## Install

SemanticApi targets `Node.js` `8.0+` and the latest version of Chrome/FF/Safari(NO IE).\
This module is powered by ES6 [Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ( [Can I Use][CanIUse] ), and there is no way to provide a fallback/polyfill for older browser/Node.js versions.

### Node.js
* `Node.js` >= 8.0

```bash
npm install semantic-api --save
```
### Browser

* Download the files in [dist folder](https://github/pionxzh/semantic-api/dist/).

## Getting Started

```js
import SemanticApi from 'semantic-api'

console.log(SemanticApi().try.to.test.api)
// => "try/to/test/api"

console.log(SemanticApi('/').user.id(9527).profile)
// => "/user/id/9527/profile"
```

Of course, it's recommended to use a wrapper on it.

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

## Usage

### Bind function

You can bind the function like `fetch`, [axios](https://github.com/axios/axios) to perform more actions within SemanticApi.

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
Type: `string`\
Default: `""`

#### customMethods
Type: `object`\
Default: `{}`

Example:
```js
SemanticApi().api.user(9527).test.fnName(123, '456')
```

```js
customMethods = {
    fnName: function (args, calls, url) {
        // args is the list of arguments. Ex: [123, '456']
        // calls is the list of access history. Ex: ['api', 'user', 9527, 'test']
        // url is the current url. Ex: 'api/user/9527/test'

        // it's ok to interact with calls
        calls.push('anotherFnName')

        // `return` will stop the chaining and return the value immediately.
        return fetch(url, options)
    }
}
```

### .query(data)
Type: `object`

**NOTICE**: `data` didn't support nested object.\
You can override the function in `customMethods` for better functionality.

```js
const obj = { name: 'bob', age: 16, test: true }
SemanticApi().query(obj)
// => ?name=bob&age=16&test=true
```

## Credits

* Inspired by [Discord.js](https://github.com/discordjs/discord.js)

## License
[MIT](LICENSE)
