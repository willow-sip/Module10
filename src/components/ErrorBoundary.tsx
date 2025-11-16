'use client';

import { Component, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';

function ErrorWithRouter<T extends object>(Component: React.ComponentType<T>) {
  return function Wrapper(props: any) {
    const router = useRouter();
    return <Component {...props} router={router} />;
  };
}

class ErrorBoundary extends Component<{ children: ReactNode; router: NextRouter }> {
    state = {
        hasError: false
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(err: any, info: any) {
        console.log('Something went wrong:', err, info);
        this.props.router.push('/page-not-found');
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default ErrorWithRouter(ErrorBoundary);
