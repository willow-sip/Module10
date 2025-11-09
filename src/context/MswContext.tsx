'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MSWContextValue {
  isReady: boolean;
}

const MSWContext = createContext<MSWContextValue>({ isReady: false });

export function useMSW() {
  return useContext(MSWContext);
}

export function MSWProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        try {
          const { startMockingSocial } = await import('@sidekick-monorepo/internship-backend');
          await startMockingSocial();
          setIsReady(true);
        } catch (error) {
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    };

    initMSW();
  }, []);

  return (
    <MSWContext.Provider value={{ isReady }}>
      {children}
    </MSWContext.Provider>
  );
}