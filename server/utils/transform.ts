export function pascalCaseToCamelCase<T extends Record<string, unknown>>(
  object: T,
) {
  const transformedObject: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
    transformedObject[camelCaseKey] = value;
  }
  return transformedObject as T;
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
