interface customFunc {
    (method: string, data: string, args: any[], url: string): void;
}
interface customMethods {
    [propName: string]: customFunc;
}
declare class SemanticApi {
    calls: string[];
    private _proxy;
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
     * check is it a method that want to get our value
     * @param {string} methodName
     */
    _isPeekingMethod(methodName: string): boolean;
    /**
     * handler when proxy trap get triggered
     * @param {string} property the property/method name being accessed
     */
    onTrapTriggered(property: string, ...args: any[]): void;
    _buildProxy(): any;
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
    toString(): string;
}
