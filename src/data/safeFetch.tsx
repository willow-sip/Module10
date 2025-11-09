export const safeFetch = async (
  url: string,
  options?: RequestInit,
  isReady?: boolean
) => {
  if (process.env.NODE_ENV === 'development' && !isReady) {
    const maxWaitTime = 5000;
    const startTime = Date.now();

    while (!isReady && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return fetch(`http://localhost:3000${url}`, options);
};
