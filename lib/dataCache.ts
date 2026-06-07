export const dataCache = new Map<string, Promise<any>>();

export function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (!dataCache.has(key)) {
    const promise = fetcher().catch(e => {
      dataCache.delete(key);
      throw e;
    });
    dataCache.set(key, promise);
  }
  return dataCache.get(key) as Promise<T>;
}

export function invalidateCache(key: string) {
  dataCache.delete(key);
}
