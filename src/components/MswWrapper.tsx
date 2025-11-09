// components/MSWWrapper.tsx
'use client';

// Wrap your children prop from main layout to this wrapper component after all context providers

import { useMSW } from '@/context/MswContext';
import { ReactNode } from 'react';

interface MSWWrapperProps {
  children: ReactNode;
}

export function MSWWrapper({ children }: MSWWrapperProps) {
  const { isReady } = useMSW();

  return <>{isReady ? children : null}</>;
}