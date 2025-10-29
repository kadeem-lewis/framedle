import { format } from "date-fns";

type QueueItem = {
  key: string;
  queuePosition: number;
  used: boolean;
  usedAt: string | null;
};

export type DailyQueue = {
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
) {
  const result = await useDrizzle()
    .select()
    .from(tables.queue)
    .where(eq(tables.queue.name, name));

  const existingQueue: DailyQueue | null =
    result.length > 0 ? result[0].data : null;
  let finalQueueData: DailyQueue;

  if (!existingQueue) {
    // SCENARIO 1: INITIALIZATION
    // The queue doesn't exist in the database, so we create it.
    console.log(`💡 No '${name}' queue found in DB. Creating a new one...`);
    const newQueueItems = createNewQueue(sourceKeys);
    finalQueueData = {
      length: newQueueItems.length,
      cycleNumber: 1,
      queue: newQueueItems,
    };
  } else {
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
        upcomingItems.push({
          key,
          queuePosition: -1,
          used: false,
          usedAt: null,
        });
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

      finalQueueData = {
        ...existingQueue,
        length: finalQueue.length,
        queue: finalQueue,
      };
    } else if (existingQueue.queue.every((item) => item.used)) {
      console.log(
        `🏁 Cycle ${existingQueue.cycleNumber} for '${name}' is complete. Generating new cycle...`,
      );

      const lastUsedItem = existingQueue.queue.find(
        (item) => item.queuePosition === existingQueue.length - 1,
      );
      const newQueueItems = createNewQueue(sourceKeys, lastUsedItem?.key);

      finalQueueData = {
        length: newQueueItems.length,
        cycleNumber: existingQueue.cycleNumber + 1,
        queue: newQueueItems,
      };
    } else {
      console.log(`👍 '${name}' queue is up to date.`);
      finalQueueData = existingQueue;
    }
    await useDrizzle()
      .insert(tables.queue)
      .values({
        name: name,
        data: finalQueueData,
        updatedAt: format(new Date(), "yyyy-MM-dd"),
      })
      .onConflictDoUpdate({
        target: tables.queue.name,
        set: {
          data: finalQueueData,
          updatedAt: format(new Date(), "yyyy-MM-dd"),
        },
      });
  }
}

export async function getNextFromQueue(
  name: "warframe" | "ability",
): Promise<string> {
  const result = await useDrizzle()
    .select()
    .from(tables.queue)
    .where(eq(tables.queue.name, name));

  if (result.length === 0) {
    throw createError(`No queue found for name: ${name}`);
  }

  const queueData = result[0].data;

  // 2. FIND NEXT
  const nextItem = queueData.queue.find((item) => !item.used);

  if (!nextItem) {
    // This is a critical error. The generate:warframes task should have reset the queue.
    throw new Error(
      `CRITICAL: No available items in the '${name}' queue. Please run the data generation task.`,
    );
  }

  // 3. MODIFY
  const nextItemIndex = queueData.queue.findIndex(
    (item) => item.key === nextItem.key,
  );
  if (nextItemIndex > -1) {
    queueData.queue[nextItemIndex].used = true;
    queueData.queue[nextItemIndex].usedAt = new Date().toISOString();
  }

  // 4. WRITE
  await useDrizzle()
    .update(tables.queue)
    .set({ data: queueData, updatedAt: format(new Date(), "yyyy-MM-dd") })
    .where(eq(tables.queue.name, name));

  return nextItem.key;
}
