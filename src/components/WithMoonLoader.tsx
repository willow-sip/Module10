'use client';

import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';

interface Props {
    props: {
        authMode: "signin" | "signup";
    } | null;
}

function WithMoonLoader(WrappedComponent: React.ComponentType<Props>) {
    return function VerificationComponent(props: Props) {
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

