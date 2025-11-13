'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/slices/authSlice';
import { restoreAuth } from '@/slices/restoreAuth';
import { RootState } from '@/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const expiresAt = useSelector((state: RootState) => state.auth.expiresAt);

    useEffect(() => {
        restoreAuth();
    }, []);

    useEffect(() => {
        if (expiresAt) {
            const timeout = expiresAt - Date.now();

            if (timeout <= 0) {
                dispatch(clearAuth());
                router.push('/');
            } else {
                const timer = setTimeout(() => {
                    dispatch(clearAuth());
                    router.push('/');
                }, timeout);
                return () => clearTimeout(timer);
            }
        }
    }, [expiresAt, dispatch, router]);

    return <>{children}</>;
}