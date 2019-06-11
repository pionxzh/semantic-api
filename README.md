# Semantic Api

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

SemanticApi allows you to declare and use the api with chaining-function-call way.

```js
Manager.api.admin.user.id(123).edit.get()
// => Get request to "https://example.com/admin/user/id/123/edit"
```

## Install

### Node
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

You can also build the API without baseUrl but it's **NOT RECOMMENDED**. This is god damn weird lol.

```js
class Manager {
    static get API () {
        return new SemanticApi()
    }
}

const options = { keyword: 'blog', page: 2, sort: 'desc' }
console.log(Manager.API.https().www.dot().facebook.dot().com.pages.search.query(options))
// => https://www.facebook.com/pages/search?keyword=blog&page=2&sort=desc
```

## Usage

### Bind function

You can bind the function like `fetch` to perform more action within SemanticApi. Overriding function is available in this way too.

```js
import SemanticApi from 'semantic-api'

const customFn = {
    get: function (method, data, args, url) { ... },
    post: function (method, data, args, url) {
        return fetch(url, data, { method: 'post', ... })
    }
}

class Instgram {
    static get api () {
        return new SemanticApi('https://api.instagram.com/', customFn)
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
Below is the api available to use in customMethod like the example in [Usage](#usage).

`function (method, data, args, url) { ... }`
* `method` is the methodName being called.
* `data` is the data in `.methodName(data, ...args)`
* `args` is the data in `.methodName(data, ...args)`
* `url` is the url or string of current result.

### Methods

* `this.calls`
  * The list store all the property access and method call.
* `this.push(item, ...args)`
  * Push item into the call list.
* `this.pop()`
  * Pop item from the call list.
* `this.bonding(bondingStr)`
  * Bond previous and next item with the `bondingStr` without delimiter `"/"`.

## Credits

* Inspired by [Discord.js](https://github.com/discordjs/discord.js)

## License
[MIT](LICENSE)
