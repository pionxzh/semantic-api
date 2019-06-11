class SemanticApi {
    /**
     * @param {string} baseUrl the baseUrl that will be added at the start of url
     * @param {object} customMethods key-value custom method function
     */
    constructor (baseUrl = '', customMethods = {}) {
        this.calls = []
        this.delimiter = '/'
        this.baseUrl = baseUrl
        this.methods = {
            query: function (method, data, args, url) {
                if (data === undefined) {
                    this.push(method)
                } else {
                    const prev = this.pop() || ''
                    const queryStringify = (opts = {}) => Object.keys(opts).map(name => `${name}=${opts[name]}`).join('&')
                    this.push(`${prev}?${queryStringify(data)}`)
                }
            }
        }
        this.methods = Object.assign({}, this.methods, customMethods)
        this._proxy = this._buildProxy()
        return this._proxy
    }
    /**
     * return is ES6-Proxy supported
     */
    _isSupportProxy () {
        return typeof Proxy === 'function'
    }
    /**
     * check is method exist and is it a function
     * @param {string} methodName
     */
    _isMethod (methodName) {
        return this.methods.hasOwnProperty(methodName) && typeof this.methods[methodName] === 'function'
    }
    /**
     * check is it a method that want to get our value
     * @param {string} methodName
     */
    _isPeekingMethod (methodName) {
        const reflectors = [
            'toString', 'valueOf', 'inspect', 'constructor',
            Symbol.toPrimitive,
            Symbol.for('util.inspect.custom'),
            // https://github.com/targos/node/commit/cc9898bd7747d2884afe9da8fff7e954225ba347
            Symbol.for('nodejs.util.inspect.custom')
        ]
        return reflectors.includes(methodName)
    }
    /**
     * handler when proxy trap get triggered
     * @param {string} property the property/method name being accessed
     */
    onTrapTriggered (property, ...args) {
        this.push(property, ...args)
    }
    _buildProxy () {
        if (!this._isSupportProxy()) {
            throw new Error('Proxy is not supported in current environment.')
        }
        // Non-extensible object
        const noop = Object.seal(() => { })
        const handler = {
            get: (target, property, receiver) => {
                if (this._isPeekingMethod(property)) {
                    return () => this.toString()
                }
                this.onTrapTriggered(property)
                return this._proxy
            },
            apply: (target, receiver, args) => {
                const methodName = this.pop()
                if (this._isMethod(methodName)) {
                    const value = args.shift()
                    let result = this.methods[methodName].call(this, methodName, value, args, this.toString())
                    if (result !== undefined) { return result }
                } else {
                    this.onTrapTriggered(methodName, ...args)
                }
                return this._proxy
            }
        }
        return new Proxy(noop, handler)
    }
    /**
     * push item to call list
     * @param {string|number} item
     * @param args
     */
    push (item, ...args) {
        if (args.length) { args = args.map(arg => arg.toString()) }
        this.calls.push(item.toString(), ...args)
    }
    /**
     * pop item from call list
     */
    pop () {
        return this.calls.pop()
    }
    toString () {
        return this.baseUrl + this.calls.join(this.delimiter)
    }
}
module.exports = SemanticApi
