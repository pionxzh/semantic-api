(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  class SemanticApi {
    /**
     * @param {string} baseUrl the baseUrl that will be added at the start of url
     * @param {object} customMethods key-value custom method function
     */
    constructor() {
      let baseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      let customMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _defineProperty(this, "calls", void 0);

      _defineProperty(this, "_proxy", void 0);

      _defineProperty(this, "bondingStr", void 0);

      _defineProperty(this, "waitForBonding", void 0);

      _defineProperty(this, "baseUrl", void 0);

      _defineProperty(this, "delimiter", void 0);

      _defineProperty(this, "methods", void 0);

      this.calls = [];
      this.delimiter = '/';
      this.baseUrl = baseUrl;
      this.methods = {
        dot: function dot(method, data, args, url) {
          data === undefined ? this.bonding('.') : this.push(method, data, ...args);
        },
        slash: function slash(method, data, args, url) {
          data === undefined ? this.bonding('/') : this.push(method, data, ...args);
        },
        http: function http(method, data, args, url) {
          data === undefined ? this.bonding('http://') : this.push(method, data, ...args);
        },
        https: function https(method, data, args, url) {
          data === undefined ? this.bonding('https://') : this.push(method, data, ...args);
        },
        query: function query(method, data, args, url) {
          if (data === undefined) {
            this.push(method, data, ...args);
          } else {
            const prev = this.pop();

            const queryStringify = function queryStringify() {
              let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
              return Object.keys(opts).map(name => "".concat(name, "=").concat(opts[name])).join('&');
            };

            this.push("".concat(prev, "?").concat(queryStringify(data)));
          }
        }
      };
      this.methods = _objectSpread({}, this.methods, customMethods);
      this._proxy = this._buildProxy();
      return this._proxy;
    }
    /**
     * return is ES6-Proxy supported
     */


    _isSupportProxy() {
      return typeof Proxy === 'function';
    }
    /**
     * check is method exist and is it a function
     * @param {string} methodName
     */


    _isMethod(methodName) {
      return this.methods.hasOwnProperty(methodName) && typeof this.methods[methodName] === 'function';
    }
    /**
     * build and return the new proxy instance
     */


    _buildProxy() {
      // GoogleChrome/proxy-polyfill needs to ensure the property at creation time.
      // Which is useless for our use case. And there is no other useable alternative choice.
      if (!this._isSupportProxy()) {
        throw new Error('Proxy is not supported in current environment.');
      } // Non-extensible object


      const noop = Object.seal(() => {});
      const handler = {
        get: (target, property, receiver) => {
          const reflectors = ['toString', 'valueOf', 'inspect', 'constructor', Symbol.toPrimitive, Symbol.for('util.inspect.custom'), // https://github.com/targos/node/commit/cc9898bd7747d2884afe9da8fff7e954225ba347
          Symbol.for('nodejs.util.inspect.custom')];
          if (reflectors.includes(property)) return () => this.toString();
          this.onGetProperty(property);
          return this._proxy;
        },
        apply: (target, receiver, args) => {
          const methodName = this.pop();

          if (this._isMethod(methodName)) {
            const value = args.shift();
            this.methods[methodName].call(this, methodName, value, args, this.toString());
          } else {
            this.push(methodName, ...args);
          }

          return this._proxy;
        }
      };
      return new Proxy(noop, handler);
    }
    /**
     * handler when proxy trap "get" triggered
     * @param {string} property the property name being accessed
     */


    onGetProperty(property) {
      if (this.waitForBonding) {
        this.handleBonding(property);
      } else {
        this.push(property);
      }
    }
    /**
     * push item to call list
     * @param {string|number} item
     * @param args
     */


    push(item) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      args = args.map(item => item && item.toString());
      this.calls.push(item.toString(), ...args);
    }
    /**
     * pop item from call list
     */


    pop() {
      return this.calls.pop();
    }
    /**
     * bonding previous and next property with bonding string
     * @param {string} bondingStr the bonding string
     */


    bonding(bondingStr) {
      this.bondingStr = bondingStr;
      this.waitForBonding = true;
    }

    handleBonding(curr) {
      const prev = this.pop() || '';
      this.push(prev + this.bondingStr + curr);
      this.waitForBonding = false;
    }

    toString() {
      return this.baseUrl + this.calls.join(this.delimiter) + (this.waitForBonding ? this.bondingStr : '');
    }

  }

  module.exports = SemanticApi;

}));
//# sourceMappingURL=semantic-api.js.map
