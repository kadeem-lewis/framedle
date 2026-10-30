import type { WatchSource } from "vue";
import Dexie from "dexie";

const { liveQuery } = Dexie;

interface UseLiveQueryOptions {
  onError?: (err: unknown) => void;
}

export function useLiveQuery<T>(
  querier: () => T | Promise<T>,
  deps: WatchSource[],
  options: UseLiveQueryOptions = {},
) {
  const data = shallowRef<T>();
  const error = shallowRef<unknown>();
  const isLoading = shallowRef(true);

  const createSubscription = () => {
    const observable = liveQuery(querier);
    return observable.subscribe({
      next: (value) => {
        data.value = value;
        error.value = undefined;
        isLoading.value = false;
      },
      error: (err) => {
        error.value = err;
        isLoading.value = false;
        options.onError?.(err);
      },
    });
  };

  watch(
    deps,
    () => {
      data.value = undefined;
      error.value = undefined;
      isLoading.value = true;

      const subscription = createSubscription();

      onWatcherCleanup(() => {
        subscription.unsubscribe();
      });
    },
    {
      immediate: true,
      flush: "sync",
    },
  );

  return { data: data as Readonly<Ref<T | undefined>>, error, isLoading };
}
