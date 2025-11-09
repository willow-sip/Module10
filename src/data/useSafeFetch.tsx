import { useMSW } from '@/context/MswContext';

// use this hook for all api requests
// const { safeFetch, _isMSWReady } = useSafeFetch();
// _isMSWReady - the flag. If true - MSW is ready

// const response = await safeFetch('/api/posts');
// if (response.ok) {
//   const data = await response.json();
//   ...
// }


export function useSafeFetch() {
  const { isReady } = useMSW();

  const safeFetch = async (url: string, options?: RequestInit) => {
    if (process.env.NODE_ENV === 'development' && !isReady) {
      
      const maxWaitTime = 5000;
      const startTime = Date.now();
      
      while (!isReady && Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return fetch(`http://localhost:3000${url}`, options);
  };

  return { safeFetch, isMSWReady: isReady };
}