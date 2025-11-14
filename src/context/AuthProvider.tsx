'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearAuth } from '@/slices/authSlice';
import { restoreAuth } from '@/slices/restoreAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [expiresAt, setExpiresAt] = useState<number | null>(null);

    useEffect(() => {
        restoreAuth();
        const stored = localStorage.getItem("expiresAt");
        if (stored) {
            setExpiresAt(Number(stored));
        }
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
