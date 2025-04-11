export const parseReleaseDate = (releaseDate: string) => {
  return Number(releaseDate.split("-")[0]);
};
