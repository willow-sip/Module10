declare const apiHandlersSocial: (import('msw').HttpHandler | import('msw').GraphQLHandler)[];
export declare function startMockingSocial(): Promise<ServiceWorkerRegistration | undefined>;
export { apiHandlersSocial };
