import { isMatch } from "date-fns";

export const parseReleaseDate = (releaseDate: string) => {
  return Number(releaseDate.split("-")[0]);
};

export const validateParamAsDate = (param: string | undefined): boolean => {
  if (!param) return false;
  return isMatch(param, "yyyy-MM-dd");
};
