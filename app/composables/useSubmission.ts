import { format } from "date-fns";
import type { SubmissionsBody } from "#shared/schemas/submissions";

export function useSubmission() {
  const { mode, isLegacyDailyMode, isUnlimitedMode } = useGameMode();
  const { proxy } = useScriptUmamiAnalytics();
  const { updateStatsOnGameOver } = useStatsStore();
  const { currentGameState, hasWon } = storeToRefs(useGameStateStore());
  const { DEFAULT_ATTEMPTS } = useGameStore();
  const { attempts } = storeToRefs(useGameStore());
  const { currentDailyDate } = storeToRefs(useDailiesStore());
  const { activeDays } = storeToRefs(useDailiesStore());
  const { daily, rarityScore } = storeToRefs(useGridGameStore());

  function generateSubmissionBody(): SubmissionsBody {
    if (!mode.value || isUnlimitedMode(mode.value))
      throw createError("Game mode is not defined");

    let body: Partial<SubmissionsBody> = {
      mode: mode.value,
      date: currentDailyDate.value[mode.value]!,
      won: hasWon.value!,
    };
    if (mode.value === "grid") {
      body = {
        ...body,
        gridStats: {
          uniquenessScore: Number(rarityScore.value),
          solvedSlots: Object.keys(daily.value.grid),
        },
      };
    } else if (isLegacyDailyMode(mode.value)) {
      body = {
        ...body,
        guessCount: DEFAULT_ATTEMPTS - attempts.value[mode.value],
      };
    }
    return body as SubmissionsBody;
  }

  watch(
    () => currentGameState.value,
    async (newState, oldState) => {
      if (
        oldState === GameStatus.ACTIVE &&
        (newState === GameStatus.WON || newState === GameStatus.LOST)
      ) {
        if (!mode.value) return;

        console.log(
          `[Game Submission] Processing end of game for ${mode.value}...`,
        );

        proxy.track("completed game", { mode: mode.value, won: hasWon.value });

        if (isUnlimitedMode(mode.value)) return;

        updateStatsOnGameOver();

        const body = generateSubmissionBody();
        // Fire and forget (or await if you need to block)
        $fetch("/api/submissions", {
          method: "POST",
          body,
        }).catch((err) => console.error("Failed to submit score", err));

        try {
          await db.progress
            .where({
              mode: mode.value,
              ...(activeDays.value[mode.value]
                ? { day: activeDays.value[mode.value] }
                : { date: format(new Date(), "yyyy-MM-dd") }),
            })
            .modify({
              state: newState,
            });
        } catch (e) {
          console.error("Failed to update daily state in DB", e);
        }
      }
    },
  );
}
