# Semantic Api
![npm](https://img.shields.io/npm/v/semantic-api.svg)
[![Build Status](https://travis-ci.org/pionxzh/SemanticApi.svg?branch=master)](https://travis-ci.org/pionxzh/SemanticApi)
[![Coverage Status](https://coveralls.io/repos/github/pionxzh/SemanticApi/badge.svg?branch=master)](https://coveralls.io/github/pionxzh/SemanticApi?branch=master)
![David](https://img.shields.io/david/pionxzh/semantic-api.svg?color=%23009688)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

🎏 A Javascript module for better API url readability.

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

Still remember how you hard-code url or config the API link in `config.json` ?

SemanticApi provides a better way to declare and use the api with chaining-function-call.

```js
Manager.api.admin.user.id(123).edit.get()
// => Get request to "https://example.com/admin/user/id/123/edit"
```

## Install

### Node.js
* `Node.js` >= 8.0

```bash
npm install semantic-api --save
```
### Browser

SemanticApi is powered by ES6 `Proxy` ( [Can I Use][CanIUse] ), and there is no possibility to provide a Fallback for our use case. Because all the polyfill need to know the property at creation time.

* Download the file in [dist folder](https://github/pionxzh/semantic-api/dist/).

## Getting Started

```js
import SemanticApi from 'semantic-api'

const API = {
    get example () {
        return new SemanticApi('/')
    },

    get spotify () {
        return new SemanticApi('https://api.spotify.com/')
    }
}

console.log(API.example.api.v4.user(9527).account.edit())
// => /api/v4/user/9527/account/edit

API.spotify.music.category(7).filter.query({ premium: true })
// => https://api.spotify.com/music/category/7/filter?premium=true
```

## Usage

### Bind function

You can bind the function like `fetch` to perform more action within SemanticApi.

```js
import SemanticApi from 'semantic-api'

class Instgram {
    static get api () {
        const baseUrl = 'https://api.instagram.com/'
        const customFn = {
            get: function (method, data, args, url) { ... },
            post: function (method, data, args, url) {
                return fetch(url, data, { method: 'post', ... })
            }
        }
        return new SemanticApi(baseUrl, customFn)
    }

    static login (data) {
        const options = { client_id: 'CLIENT-ID', redirect_uri: 'REDIRECT-URI' }
        return Instgram.api.oauth.authorize.query().post(data)
    }
}

Instgram.login()
// GET https://api.instagram.com/oauth/authorize?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI
```

## API

new SemanticApi(**baseUrl**, **customMethods**)

| Options       | Type     | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| baseUrl       | `string` | Base url. Default: `""`                                 |
| customMethods | `object` | Object of custom functions that want to be injected in. |

## Credits

* Inspired by [Discord.js](https://github.com/discordjs/discord.js)

## License
[MIT](LICENSE)
