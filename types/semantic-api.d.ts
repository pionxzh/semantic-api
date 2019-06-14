interface customFunc {
    (args: any[], calls: any[], url: string): void;
}
interface customMethods {
    [propName: string]: customFunc;
}
interface queryOption {
    [propName: string]: any;
}
declare const checkProxySupport: () => void;
declare const isReflectorMethod: (methodName: string) => boolean;
declare const query: (args: any[], calls: any[], url: string) => void;
/**
 * @param {string} baseUrl the baseUrl that will be added at the start of url
 * @param {object} customFunctions key-value custom method function
 */
declare function SemanticApi(baseUrl?: string, customFunctions?: customMethods): Function;
