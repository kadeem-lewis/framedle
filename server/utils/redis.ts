import Redis from "ioredis";

let _client: Redis | null = null;

export const useRedis = () => {
  const runtimeConfig = useRuntimeConfig();
  if (!_client) {
    // This creates a NEW, separate connection
    _client = new Redis(runtimeConfig.redis.url);
  }
  return _client;
};
