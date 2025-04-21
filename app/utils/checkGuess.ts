type Result = "correct" | "incorrect" | "higher" | "lower";

export function checkGuess(
  correctValue: string | number,
  guessedValue: string | number,
): Result {
  if (typeof correctValue === "string" || typeof guessedValue === "string") {
    console.log(
      "string comparison",
      correctValue === guessedValue ? "correct" : "incorrect",
    );
    return correctValue === guessedValue ? "correct" : "incorrect";
  }

  if (correctValue > guessedValue) {
    return "higher";
  }
  if (correctValue < guessedValue) {
    return "lower";
  }
  return "correct";
}
