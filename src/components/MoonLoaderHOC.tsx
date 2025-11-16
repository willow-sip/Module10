'use client';

import { Suspense } from 'react';
import { MoonLoader } from 'react-spinners';

function withMoonLoader<T extends object>(WrappedComponent: React.ComponentType<T>) {
    return function VerificationComponent(props: T) {
        return (
            <Suspense fallback={<MoonLoader style={{ margin: '0 auto' }} />}>
                <WrappedComponent {...props} />
            </Suspense>
        );
    };
}

export default withMoonLoader;

