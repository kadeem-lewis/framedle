export function useUmamiAnalytics() {
  const {
    public: { umamiAnalytics },
  } = useRuntimeConfig();

  return useScriptUmamiAnalytics({
    websiteId: umamiAnalytics.websiteId,
    hostUrl: umamiAnalytics.hostUrl,
  });
}
