import { S3Client } from "@aws-sdk/client-s3";

let _client: S3Client | null = null;

export function useR2Storage() {
  if (_client) return _client;
  const runtimeConfig = useRuntimeConfig();

  _client = new S3Client({
    region: "auto",
    endpoint: runtimeConfig.r2.endpoint,
    credentials: {
      accessKeyId: runtimeConfig.r2.accessKeyId,
      secretAccessKey: runtimeConfig.r2.secretAccessKey,
    },
  });

  return _client;
}

export const getR2BucketName = () => useRuntimeConfig().r2.bucketName;
