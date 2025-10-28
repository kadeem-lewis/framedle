import { expect, describe, it } from "vitest";
import { parseReleaseDate } from "../../app/utils/date.ts";

describe("parseReleaseDate", () => {
  it("should return only the year", () => {
    const releaseDate = parseReleaseDate("2025-05-05");
    expect(releaseDate).toEqual(2025);
  });

  // This is just default js behavior so a test may not be necessary but I should maybe be handling this better instead of just returning NaN
  it("should return NaN for invalid date", () => {
    const releaseDate = parseReleaseDate("invalid-date");
    expect(releaseDate).toBeNaN();
  });
});
