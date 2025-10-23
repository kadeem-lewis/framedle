export function useShare() {
  const emojis: {
    incorrect: string;
    correct: string;
    lower: string;
    higher: string;
    unused: string;
  } = {
    incorrect: "🟥",
    correct: "🟩",
    lower: "🔽",
    higher: "🔼",
    unused: "◻️",
  };

  const emojiFeedback = ref<string[]>([]);

  const { guessedItems, itemToGuess, attempts } = storeToRefs(useGameStore());
  const { DEFAULT_ATTEMPTS } = useGameStore();
  const { currentDay } = storeToRefs(useDailiesStore());

  const mode = useGameMode();
  const { hasWon } = storeToRefs(useGameStateStore());

  const { encode } = useEncoder();

  const route = useRoute();
  const { copy, copied } = useClipboard();

  function generateClassicEmojiFeedback(
    correctItem: Warframe,
    guessedItem: Warframe,
  ) {
    const gridRow: string[] = [];

    gridRow.push(
      emojis[checkGuess(correctItem.sex, guessedItem.sex)],
      emojis[checkGuess(correctItem.variant, guessedItem.variant)],
      emojis[checkGuess(correctItem.health, guessedItem.health)],
      emojis[checkGuess(correctItem.shield, guessedItem.shield)],
      emojis[checkGuess(correctItem.progenitor, guessedItem.progenitor)],
      emojis[
        checkGuess(
          parseReleaseDate(correctItem.releaseDate),
          parseReleaseDate(guessedItem.releaseDate),
        )
      ],
    );

    return gridRow.join("");
  }

  function handleShareClick() {
    const currentMode = mode.value;
    if (!currentMode) throw createError("Mode is not set");
    if (currentMode === "ability" || currentMode === "abilityUnlimited") {
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (!itemToGuess.value[currentMode]?.belongsTo) return;
        emojiFeedback.value.push(
          emojis[
            checkGuess(itemToGuess.value[currentMode]?.belongsTo, guessedItem)
          ],
        );
      });
      emojiFeedback.value = emojiFeedback.value.concat(
        new Array(attempts.value[currentMode]).fill(emojis.unused),
      );
    }
    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      const correctItem = itemToGuess.value[currentMode];
      guessedItems.value[currentMode].forEach((guessedItem) => {
        if (correctItem) {
          emojiFeedback.value.push(
            generateClassicEmojiFeedback(
              getWarframe(correctItem),
              getWarframe(guessedItem),
            ),
          );
        }
      });
    }

    //! As more game modes are added, this will need to be updated
    const emojiGrid =
      route.name === "classic-path"
        ? emojiFeedback.value.join("\n")
        : emojiFeedback.value.join(" ");

    const attemptsUsed = DEFAULT_ATTEMPTS - attempts.value[currentMode];

    const topText = route.path.includes("unlimited")
      ? hasWon.value
        ? `I solved a Framedle in ${attemptsUsed} out of ${DEFAULT_ATTEMPTS} turns.`
        : `I couldn't solve this Framedle in ${DEFAULT_ATTEMPTS} turns.`
      : `Framedle ${currentMode} #${currentDay.value} ${hasWon.value ? attemptsUsed : "X"}/${DEFAULT_ATTEMPTS}`;

    const grid = `
${topText}
      
${emojiGrid}
${
  route.path.includes("unlimited")
    ? `See how you do on the same challenge I played:
${window.location.href}?x=${itemToGuess.value[currentMode] && encode(`${itemToGuess.value[currentMode]}`)}`
    : window.location.href
}
        `;
    copy(grid);
    emojiFeedback.value = [];
  }

  const { stats } = storeToRefs(useStatsStore());

  function handleStatsShare() {
    if (!mode.value) return;
    const currentMode = mode.value;
    let currentStats: (typeof stats.value)[keyof typeof stats.value];
    let modeName = "";
    if (currentMode === "classic" || currentMode === "classicUnlimited") {
      currentStats = stats.value.classic;
      modeName = "Classic";
    } else if (
      currentMode === "ability" ||
      currentMode === "abilityUnlimited"
    ) {
      currentStats = stats.value.ability;
      modeName = "Ability";
    } else {
      throw createError("Invalid mode");
    }
    const { plays, wins, guesses, streak, maxStreak } = currentStats;

    const totalWeightedGuesses = guesses.reduce((acc, curr, index) => {
      return acc + curr * (index + 1);
    }, 0);

    const averageGuesses = wins > 0 ? totalWeightedGuesses / wins : 0;

    const shareMessage = `My #Framedle statistics for ${modeName}:
    ⚔️ Games Played: ${plays}
    👑 Games Won: ${wins}
    🎯 Average Guesses: ${averageGuesses.toFixed(2)}
    🔥 Current Streak: ${streak}
    🚀 Max Streak: ${maxStreak}

    https://framedle.com${route.path}
    `;
    copy(shareMessage);
  }

  return { handleShareClick, copied, handleStatsShare };
}
