import { createClient } from "redis";

let _client: ReturnType<typeof createClient> | null = null;

export const useRedis = async () => {
  const runtimeConfig = useRuntimeConfig();

  if (_client && _client.isOpen) {
    return _client;
  }
  if (!_client) {
    _client = createClient({
      url: runtimeConfig.redis.url,
      RESP: 3,
      clientSideCache: {
        ttl: 60 * 60 * 1000,
        maxEntries: 5000,

        evictPolicy: "LRU",
      },
    });

    _client.on("error", (err) => console.error("Redis Client Error", err));

    await _client.connect();
  }
  return _client;
};
