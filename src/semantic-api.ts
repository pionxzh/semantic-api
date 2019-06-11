interface customFunc {
    (method: string, data: string, args: any[], url: string): void
}

interface customMethods {
    [propName:string]: customFunc
}

class SemanticApi {
    public calls: string[]
    private _proxy: any
    protected baseUrl: string
    protected delimiter: string
    protected methods: customMethods

    /**
     * @param {string} baseUrl the baseUrl that will be added at the start of url
     * @param {object} customMethods key-value custom method function
     */
    constructor (baseUrl = '', customMethods = {}) {
        this.calls = []
        this.delimiter = '/'
        this.baseUrl = baseUrl
        this.methods = {
            query: function (method: string, data: any, args: any[], url: string) {
                if (data === undefined) {
                    this.push(method)
                } else {
                    const prev = this.pop()
                    const queryStringify = (opts: {[prop: string]: string|number} = {}) => Object.keys(opts).map(name => `${name}=${opts[name]}`).join('&')
                    this.push(`${prev}?${queryStringify(data)}`)
                }
            }
        }

        this.methods = { ...this.methods, ...customMethods }
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
    _isMethod (methodName: string) {
        return this.methods.hasOwnProperty(methodName) && typeof this.methods[methodName] === 'function'
    }

    /**
     * check is it a method that want to get our value
     * @param {string} methodName
     */
    _isPeekingMethod (methodName: string) {
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
    onTrapTriggered (property: string, ...args: any[]) {
        this.push(property, ...args)
    }

    _buildProxy () {
        if (!this._isSupportProxy()) {
            throw new Error('Proxy is not supported in current environment.')
        }

        // Non-extensible object
        const noop = Object.seal(() => {})
        const handler = {
            get: (target: any, property: string, receiver: any) => {
                if (this._isPeekingMethod(property)) {
                    return () => this.toString()
                }

                this.onTrapTriggered(property)
                return this._proxy
            },

            apply: (target: any, receiver: any, args: any[]) => {
                const methodName = this.pop()

                if (this._isMethod(methodName)) {
                    const value = args.shift()
                    let result = this.methods[methodName].call(this, methodName, value, args, this.toString())
                    if (result !== undefined) return result
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
    push (item: string|number, ...args: any[]) {
        if (args.length) args = args.map(arg => arg.toString())
        this.calls.push(item.toString(), ...args)
    }

    /**
     * pop item from call list
     */
    pop (): string {
        return this.calls.pop()
    }

    toString () {
        return this.baseUrl + this.calls.join(this.delimiter)
    }
}

module.exports = SemanticApi
