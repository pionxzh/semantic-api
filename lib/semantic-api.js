const checkProxySupport = () => {
    if (typeof Proxy === 'function') { return }
    throw new Error('Proxy is not supported.')
}
const isReflectorMethod = (methodName) => {
    const reflectors = [
        'valueOf',
        'inspect',
        'toString',
        'constructor',
        Symbol.toPrimitive,
        Symbol.toStringTag,
        Symbol.for('util.inspect.custom'),
        Symbol.for('nodejs.util.inspect.custom')
    ]
    return reflectors.includes(methodName)
}
const query = (args, calls, url) => {
    const queryString = (opts) => Object.keys(opts).map(key => `${key}=${encodeURIComponent(opts[key])}`).join('&')
    const data = args.shift()
    const prev = calls.pop() || ''
    const result = data ? `${prev}?${queryString(data)}` : 'query'
    calls.push(result)
}
/**
 * @param {string} baseUrl the baseUrl that will be added at the start of url
 * @param {object} customFunctions key-value custom method function
 */
function SemanticApi (baseUrl = '', customFunctions = {}) {
    checkProxySupport()
    let calls = []
    const delimiter = '/'
    const toString = () => baseUrl + calls.join(delimiter)
    // Create proxy and declare set/apply trap
    let proxy = null
    const methodList = Object.assign({ query }, customFunctions)
    const isMethod = (name) => methodList.hasOwnProperty(name) && typeof methodList[name] === 'function'
    const createProxy = () => {
        const getTrap = (target, property, receiver) => {
            if (isReflectorMethod(property)) { return () => toString() } else { calls.push(property) }
            return proxy
        }
        const applyTrap = (target, receiver, args) => {
            const methodName = calls.pop()
            if (isMethod(methodName)) {
                const url = toString()
                const result = methodList[methodName].call(this, args, calls, url)
                if (result !== undefined) { return result }
            } else {
                calls.push(methodName, ...args)
            }
            return proxy
        }
        const noop = Object.seal(() => { })
        return new Proxy(noop, { get: getTrap, apply: applyTrap })
    }
    proxy = createProxy()
    return proxy
}
module.exports = SemanticApi
