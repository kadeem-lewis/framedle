export function transformKeys(object: Record<string, unknown>) {
  const transformedObject: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    transformedObject[key.toLowerCase()] = value;
  }
  return transformedObject;
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
