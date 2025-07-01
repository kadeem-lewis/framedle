export const isValidDayNumber = (value: string): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

export const validateRoute = (route: ReturnType<typeof useRoute>): boolean => {
  if (route.name === "ability-path" || route.name === "classic-path") {
    const paths = route.params.path;
    if (!paths) return true;
    if (paths[0] === "unlimited") return true;
    if (paths.length > 1) return false;
    if (paths[0] && isValidDayNumber(paths[0])) return true;
  }
  return false;
};
