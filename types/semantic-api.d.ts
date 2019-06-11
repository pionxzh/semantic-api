interface customFunc {
    (method: string, data: string, args: any[], url: string): void;
}
interface customMethods {
    [propName: string]: customFunc;
}
declare class SemanticApi {
    calls: string[];
    private _proxy;
    private bondingStr;
    private waitForBonding;
    protected baseUrl: string;
    protected delimiter: string;
    protected methods: customMethods;
    /**
     * @param {string} baseUrl the baseUrl that will be added at the start of url
     * @param {object} customMethods key-value custom method function
     */
    constructor(baseUrl?: string, customMethods?: {});
    /**
     * return is ES6-Proxy supported
     */
    _isSupportProxy(): boolean;
    /**
     * check is method exist and is it a function
     * @param {string} methodName
     */
    _isMethod(methodName: string): boolean;
    /**
     * build and return the new proxy instance
     */
    _buildProxy(): any;
    /**
     * handler when proxy trap "get" triggered
     * @param {string} property the property name being accessed
     */
    onGetProperty(property: string): void;
    /**
     * push item to call list
     * @param {string|number} item
     * @param args
     */
    push(item: string | number, ...args: any[]): void;
    /**
     * pop item from call list
     */
    pop(): string;
    /**
     * bonding previous and next property with bonding string
     * @param {string} bondingStr the bonding string
     */
    bonding(bondingStr: string): void;
    handleBonding(curr: string): void;
    toString(): string;
}
