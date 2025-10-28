import { promises as fs } from "fs";

type QueueItem = {
  key: string;
  queuePosition: number;
  used: boolean;
  usedAt: string | null;
};

type QueueFile = {
  length: number;
  cycleNumber: number;
  queue: QueueItem[];
};

export function createNewQueue(
  sourceKeys: string[],
  lastUsedKey?: string,
): QueueItem[] {
  const shuffledKeys = shuffle(sourceKeys);

  // PREVENT BACK-TO-BACK REPEATS: If the first item of the new shuffle
  // is the same as the last item of the previous cycle, we swap it.
  if (
    lastUsedKey &&
    shuffledKeys.length > 1 &&
    shuffledKeys[0] === lastUsedKey
  ) {
    // A simple and effective swap with the last element.
    const firstItem = shuffledKeys[0];
    shuffledKeys[0] = shuffledKeys[shuffledKeys.length - 1];
    shuffledKeys[shuffledKeys.length - 1] = firstItem;
  }

  return shuffledKeys.map((key, index) => ({
    key,
    queuePosition: index,
    used: false,
    usedAt: null,
  }));
}

export async function processQueue(
  name: "warframe" | "ability",
  sourceKeys: string[],
): Promise<QueueFile> {
  const filePath = `./server/data/${name}-queue.json`;
  let existingQueue: QueueFile | null = null;

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    existingQueue = JSON.parse(fileContent);
  } catch (error) {
    // **SCENARIO 1: INITIALIZATION**
    // The file doesn't exist, so we create a new one from scratch.
    console.error("Error reading queue file:", error);
    console.log(`💡 No '${name}' queue found. Creating a new one...`);
    const newQueueItems = createNewQueue(sourceKeys);
    return {
      length: newQueueItems.length,
      cycleNumber: 1,
      queue: newQueueItems,
    };
  }

  if (!existingQueue) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to process existing ${name} queue.`,
    });
  }

  // --- Logic for an EXISTING queue file ---

  // **SCENARIO 2: MID-CYCLE UPDATE (New Item Added)**
  if (sourceKeys.length > existingQueue.length) {
    console.log(
      `🚀 New '${name}' item(s) detected! Reshuffling upcoming queue...`,
    );

    const existingKeys = new Set(existingQueue.queue.map((item) => item.key));
    const newKeys = sourceKeys.filter((key) => !existingKeys.has(key));

    const usedItems = existingQueue.queue.filter((item) => item.used);
    const upcomingItems = existingQueue.queue.filter((item) => !item.used);

    // Add the newcomers to the upcoming pool.
    newKeys.forEach((key) => {
      upcomingItems.push({ key, queuePosition: -1, used: false, usedAt: null });
    });

    // Reshuffle ONLY the upcoming items.
    const shuffledUpcoming = shuffle(upcomingItems);

    // Recombine, re-assign positions, and return.
    const finalQueue = [...usedItems, ...shuffledUpcoming].map(
      (item, index) => ({
        ...item,
        queuePosition: index,
      }),
    );

    return { ...existingQueue, length: finalQueue.length, queue: finalQueue };
  }

  // **SCENARIO 3: END-OF-CYCLE RESET**
  const isCycleComplete = existingQueue.queue.every((item) => item.used);
  if (isCycleComplete) {
    console.log(
      `🏁 Cycle ${existingQueue.cycleNumber} for '${name}' is complete. Generating new cycle...`,
    );

    const lastUsedItem = existingQueue.queue.find(
      (item) => item.queuePosition === existingQueue.length - 1,
    );
    const newQueueItems = createNewQueue(sourceKeys, lastUsedItem?.key);

    return {
      length: newQueueItems.length,
      cycleNumber: existingQueue.cycleNumber + 1,
      queue: newQueueItems,
    };
  }

  // **SCENARIO 4: NO CHANGE NEEDED**
  console.log(`👍 '${name}' queue is up to date.`);
  return existingQueue;
}
