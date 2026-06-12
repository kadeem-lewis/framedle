import { createClient } from "redis";

let _client: ReturnType<typeof createClient> | null = null;

export const useRedis = async () => {
  const runtimeConfig = useRuntimeConfig();

  if (!_client) {
    _client = createClient({
      url: runtimeConfig.redis.url,
      RESP: 3,
    });

    _client.on("error", (err) => console.error("Redis Client Error", err));

    if (!_client.isOpen) {
      try {
        await _client.connect();
      } catch (e) {
        if (e instanceof Error && e.message === "Socket already opened") {
          // Safe to ignore, do nothing
        } else {
          throw e;
        }
      }
    }
  }
  return _client;
};
