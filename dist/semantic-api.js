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

  const checkProxySupport = () => {
    if (typeof Proxy === 'function') return;
    throw new Error('Proxy is not supported.');
  };

  const isReflectorMethod = methodName => {
    const reflectors = ['valueOf', 'inspect', 'toString', 'constructor', Symbol.toPrimitive, Symbol.toStringTag, Symbol.for('util.inspect.custom'), Symbol.for('nodejs.util.inspect.custom')];
    return reflectors.includes(methodName);
  };

  const query = (args, calls, url) => {
    const queryString = opts => Object.keys(opts).map(key => "".concat(key, "=").concat(encodeURIComponent(opts[key]))).join('&');

    const data = args.shift();
    const prev = calls.pop() || '';
    const result = data ? "".concat(prev, "?").concat(queryString(data)) : 'query';
    calls.push(result);
  };
  /**
   * @param {string} baseUrl the baseUrl that will be added at the start of url
   * @param {object} customFunctions key-value custom method function
   */


  function SemanticApi(baseUrl = '', customFunctions = {}) {
    checkProxySupport();
    let calls = [];
    const delimiter = '/';

    const toString = () => baseUrl + calls.join(delimiter); // Create proxy and declare set/apply trap


    let proxy = null;

    const methodList = _objectSpread({
      query
    }, customFunctions);

    const isMethod = name => methodList.hasOwnProperty(name) && typeof methodList[name] === 'function';

    const createProxy = () => {
      const getTrap = (target, property, receiver) => {
        if (isReflectorMethod(property)) return () => toString();else calls.push(property);
        return proxy;
      };

      const applyTrap = (target, receiver, args) => {
        const methodName = calls.pop();

        if (isMethod(methodName)) {
          const url = toString();
          const result = methodList[methodName].call(this, args, calls, url);
          if (result !== undefined) return result;
        } else {
          calls.push(methodName, ...args);
        }

        return proxy;
      };

      const noop = Object.seal(() => {});
      return new Proxy(noop, {
        get: getTrap,
        apply: applyTrap
      });
    };

    proxy = createProxy();
    return proxy;
  }

  module.exports = SemanticApi;

}));
//# sourceMappingURL=semantic-api.js.map
