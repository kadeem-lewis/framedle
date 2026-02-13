export function resolveVariants(scrapedNames: string[]) {
  const resolved = new Set<string>();
  const normalizedScraped = new Set(scrapedNames.map((n) => n.toLowerCase()));

  warframeNames.forEach((warframeName) => {
    const warframeLine = warframeName.split(" ")[0].toLowerCase();
    if (normalizedScraped.has(warframeLine)) {
      resolved.add(warframeName);
    }
  });
  return [...resolved];
}

const validNamesSet = new Set(warframeNames.map((n) => n.toLowerCase()));

export function filterStrict(scrapedNames: string[]) {
  return scrapedNames.filter((name) => validNamesSet.has(name.toLowerCase()));
}
