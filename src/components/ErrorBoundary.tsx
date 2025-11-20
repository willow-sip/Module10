'use client';

import { Component, ReactNode } from 'react';
import { NextRouter } from 'next/router';


class ErrorBoundary extends Component<{ children: ReactNode; router: NextRouter }> {
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
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
