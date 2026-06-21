import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

type ImageJob = {
  type: "warframe" | "ability";
  sourceImageName: string;
  sourceUrl: string;
  objectKey: string;
  recordKey: string;
};

type ImageResult = {
  type: "warframe" | "ability";
  status: "uploaded" | "skipped" | "failed";
  objectKey: string;
  recordKey: string;
  error?: unknown;
};

export function isObjectMissingError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const e = error as {
    $metadata?: { httpStatusCode?: number };
    name?: string;
    Code?: string;
  };

  return (
    e?.$metadata?.httpStatusCode === 404 ||
    e?.name === "NotFound" ||
    e?.Code === "NotFound" ||
    e?.Code === "NoSuchKey"
  );
}

function buildWikiImageUrl(imageName: string) {
  return `https://wiki.warframe.com/images/${encodeURIComponent(imageName)}`;
}

function buildObjectKey(type: "warframe" | "ability", displayName: string) {
  const prefix = type === "warframe" ? "warframes" : "abilities";
  return `${prefix}/${transformToKebabCase(displayName)}.png`;
}

export async function imageAlreadyExistsInR2(objectKey: string) {
  const r2 = useR2Storage();

  try {
    await r2.send(
      new HeadObjectCommand({
        Bucket: getR2BucketName(),
        Key: objectKey,
      }),
    );
    return true;
  } catch (error: unknown) {
    if (isObjectMissingError(error)) {
      return false;
    }

    throw error;
  }
}

export async function uploadImageToR2(job: ImageJob): Promise<ImageResult> {
  const r2 = useR2Storage();

  try {
    const imageExists = await imageAlreadyExistsInR2(job.objectKey);

    if (imageExists) {
      return {
        type: job.type,
        recordKey: job.recordKey,
        objectKey: job.objectKey,
        status: "skipped",
      };
    }

    const response = await $fetch<ArrayBuffer>(job.sourceUrl, {
      responseType: "arrayBuffer",
    }).catch((error) => {
      throw new Error(
        `Failed to fetch source image for ${job.recordKey}: ${error.data}`,
      );
    });

    const body = Buffer.from(response);

    await r2.send(
      new PutObjectCommand({
        Bucket: getR2BucketName(),
        Key: job.objectKey,
        Body: body,
        ContentType: "image/png",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return {
      type: job.type,
      recordKey: job.recordKey,
      objectKey: job.objectKey,
      status: "uploaded",
    };
  } catch (error) {
    console.error("Error uploading image to R2:", error);

    return {
      type: job.type,
      recordKey: job.recordKey,
      objectKey: job.objectKey,
      status: "failed",
      error,
    };
  }
}

function createImageJobs(
  warframes: ReturnType<typeof buildWarframeData>,
  abilities: Awaited<ReturnType<typeof buildAbilityData>>,
): ImageJob[] {
  const warframeJobs: ImageJob[] = [...warframes.entries()].map(
    ([recordKey, warframe]) => ({
      type: "warframe",
      recordKey,
      sourceImageName: warframe.imageName,
      sourceUrl: buildWikiImageUrl(warframe.imageName),
      objectKey: buildObjectKey("warframe", warframe.name),
    }),
  );

  const abilityJobs: ImageJob[] = [...abilities.entries()].map(
    ([recordKey, ability]) => ({
      type: "ability",
      recordKey,
      sourceImageName: ability.imageName,
      sourceUrl: buildWikiImageUrl(ability.imageName),
      objectKey: buildObjectKey("ability", ability.name),
    }),
  );

  return [...warframeJobs, ...abilityJobs];
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  handler: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex++;

      if (currentIndex >= items.length) {
        return;
      }

      if (!items[currentIndex]) continue;
      results[currentIndex] = await handler(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );

  await Promise.all(workers);

  return results;
}

export async function syncImagesToR2(
  warframes: ReturnType<typeof buildWarframeData>,
  abilities: Awaited<ReturnType<typeof buildAbilityData>>,
) {
  const jobs = createImageJobs(warframes, abilities);

  const results = await runWithConcurrency(jobs, 5, (job) =>
    uploadImageToR2(job),
  );

  const uploaded = results.filter((r) => r.status === "uploaded").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed");

  if (failed.length) {
    console.error(
      "Failed image syncs:",
      failed.map((f) => ({
        type: f.type,
        recordKey: f.recordKey,
        objectKey: f.objectKey,
        error: f.error,
      })),
    );
  }

  const resultMap = new Map(
    results.map((result) => [
      `${result.type}:${result.recordKey}`,
      result.objectKey,
    ]),
  );

  const syncedWarframes = new Map(
    [...warframes.entries()].map(([recordKey, warframe]) => [
      recordKey,
      {
        ...warframe,
        image: resultMap.get(`warframe:${recordKey}`),
      },
    ]),
  );

  const syncedAbilities = new Map(
    [...abilities.entries()].map(([recordKey, ability]) => [
      recordKey,
      {
        ...ability,
        image: resultMap.get(`ability:${recordKey}`),
      },
    ]),
  );

  return {
    warframes: syncedWarframes,
    abilities: syncedAbilities,
    stats: {
      total: jobs.length,
      uploaded,
      skipped,
      failed: failed.length,
    },
  };
}
