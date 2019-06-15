declare module 'semantic-api' {
    interface customFunc {
        (args: any[], calls: any[], url: string): void;
    }
    interface customMethods {
        [propName: string]: customFunc;
    }
    interface queryOption {
        [propName: string]: any;
    }
    interface semanticInstance{
        [propName:string]: any
    }
    const checkProxySupport: () => void;
    const isReflectorMethod: (methodName: string) => boolean;
    const query: (args: any[], calls: any[], url: string) => void;
    /**
     * @param {string} baseUrl the baseUrl that will be added at the start of url
     * @param {object} customFunctions key-value custom method function
     */
    function SemanticApi(baseUrl?: string, customFunctions?: customMethods): semanticInstance;

    export default SemanticApi
}
