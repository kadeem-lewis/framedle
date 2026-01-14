import { Dexie } from "dexie";
const { liveQuery } = Dexie;

interface UseObservableOptions {
  onError?: (err: unknown) => void;
}

export function useLiveQuery<T>(
  querier: () => T | Promise<T>,
  deps: Ref<unknown>[],
  options?: UseObservableOptions,
): Readonly<Ref<T | undefined>> {
  const value = ref<T>();

  const createSubscription = () => {
    const observable = liveQuery(querier);
    return observable.subscribe({
      next: (val) => {
        value.value = val;
      },
      error: options?.onError,
    });
  };

  let subscription = createSubscription();

  watch(deps, () => {
    subscription.unsubscribe();
    subscription = createSubscription();
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  return value as Readonly<Ref<T | undefined>>;
}
