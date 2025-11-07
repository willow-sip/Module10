import React, { Component, ReactNode } from 'react';
import NotFoundPage from './NotFoundPage';

class ErrorBoundary extends Component<{ children: ReactNode }> {
    state = {
        hasError: false
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(err: any, info: any) {
        console.log('Something went wrong:', err, info);
    }

    render() {
        if (this.state.hasError) {
            return <NotFoundPage />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
