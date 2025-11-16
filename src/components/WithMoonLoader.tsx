'use client';

import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';

function WithMoonLoader<T extends object>(WrappedComponent: React.ComponentType<T>) {
    return function VerificationComponent(props: T) {
        return (
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress enableTrackSlot size="5rem" />
                </Box>
            }>
                <WrappedComponent {...props} />
            </Suspense>
        );
    };
}

export default WithMoonLoader;

