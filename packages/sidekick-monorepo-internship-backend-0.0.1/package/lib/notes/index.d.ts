declare const apiHandlersNotes: (import('msw').HttpHandler | import('msw').GraphQLHandler)[];
export declare function startMockingNotes(): Promise<ServiceWorkerRegistration | undefined>;
export { apiHandlersNotes };
