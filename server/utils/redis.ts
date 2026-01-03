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
    });

    _client.on("error", (err) => console.error("Redis Client Error", err));

    await _client.connect();
  }
  return _client;
};
