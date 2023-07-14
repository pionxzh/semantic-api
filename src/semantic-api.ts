export interface SemanticCustomFunc {
    (args: any[], calls: any[], url: string): void
}

export interface SemanticCustomMethods {
    [propName: string]: SemanticCustomFunc
}

export interface SemanticQueryOption {
    [propName: string]: any
}

export interface SemanticInstance {
    [propName: string]: any
}

const isReflectorMethod = (methodName: string) => {
    const reflectors = [
        'valueOf',
        'inspect',
        'toString',
        'constructor',
        Symbol.toPrimitive,
        Symbol.toStringTag,
        Symbol.for('util.inspect.custom'),
        Symbol.for('nodejs.util.inspect.custom'),
    ]
    return reflectors.includes(methodName)
}

const query = (args: any[], calls: any[]) => {
    const queryString = (opts: SemanticQueryOption) => Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join('&')
    const data = args.shift()
    const prev = calls.pop() || ''
    const result = data ? `${prev}?${queryString(data)}` : 'query'
    calls.push(result)
}

/**
 * @param {string} baseUrl the baseUrl that will be added at the start of url
 * @param {object} customFunctions key-value custom method function
 */
function SemanticApi(baseUrl = '', customFunctions: SemanticCustomMethods = {}): SemanticInstance {
    const calls: string[] = []
    const delimiter = '/'
    const toString = () => baseUrl + calls.join(delimiter)

    // Create proxy and declare set/apply trap
    let proxy: null | Function = null
    const methodList: SemanticCustomMethods = { query, ...customFunctions }
    const isMethod = (name: string) => Object.prototype.hasOwnProperty.call(methodList, name) && typeof methodList[name] === 'function'

    const createProxy = () => {
        const getTrap = (_target: any, property: string) => {
            if (isReflectorMethod(property)) return () => toString()
            else calls.push(property)

            return proxy
        }

        const applyTrap = (_target: any, _receiver: any, args: any[]) => {
            const methodName = calls.pop()
            if (isMethod(methodName)) {
                const url = toString()
                const result = methodList[methodName].call(this, args, calls, url)
                if (result !== undefined) return result
            }
            else {
                calls.push(methodName, ...args)
            }

            return proxy
        }

        const noop = Object.seal(() => {})
        return new Proxy(noop, { get: getTrap, apply: applyTrap })
    }

    proxy = createProxy()
    return proxy
}

export default SemanticApi
