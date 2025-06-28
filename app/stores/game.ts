import { format } from "date-fns";
import type { Ability as OriginalAbility } from "#shared/schemas/warframe";
import { warframes as warframeData } from "#shared/data/warframes";

type Ability = OriginalAbility & { belongsTo: string };

type itemToGuess = {
  classic: WarframeName | null;
  classicUnlimited: WarframeName | null;
  ability: Ability | null;
  abilityUnlimited: Ability | null;
};

type WarframeName = keyof typeof warframeData;

export const useGameStore = defineStore(
  "game.v2",
  () => {
    const warframes = Object.keys(warframeData) as WarframeName[];

    const itemToGuess = ref<itemToGuess>({
      classic: null,
      classicUnlimited: null,
      ability: null,
      abilityUnlimited: null,
    });

    const defaultAttempts = 6;

    const attempts = ref({
      classic: defaultAttempts,
      classicUnlimited: defaultAttempts,
      ability: defaultAttempts,
      abilityUnlimited: defaultAttempts,
    });

    const route = useRoute();
    const router = useRouter();

    const currentDailyDate = ref(format(new Date(), "yyyy-MM-dd"));
    const dailyDate = ref<string>(
      (route.query.date as string) || currentDailyDate.value,
    );
    const currentDay = ref<number>();

    const guessedItems = ref({
      classic: [] as WarframeName[],
      classicUnlimited: [] as WarframeName[],
      ability: [] as WarframeName[],
      abilityUnlimited: [] as WarframeName[],
    });

    const selectedMinigameAbility = ref({
      ability: "",
      abilityUnlimited: "",
    });

    const { decode } = useEncoder();

    //TODO: both init functions could be the same function and just pass the mode as an argument
    function classicInit() {
      if (route.query.x) {
        const decoded = decode(route.query.x as string) as WarframeName;
        const decodedWarframe = warframeData[decoded];
        if (itemToGuess.value.classicUnlimited !== decodedWarframe.name) {
          itemToGuess.value.classicUnlimited = decodedWarframe.name;
          guessedItems.value.classicUnlimited = [];
          attempts.value.classicUnlimited = defaultAttempts;
        }
      }
      if (!itemToGuess.value.classicUnlimited) {
        itemToGuess.value.classicUnlimited =
          warframes[Math.floor(Math.random() * warframes.length)] ?? null;
      }
    }

    function abilityInit() {
      if (abilities.value.length === 0)
        throw createError("Abilities not loaded");
      if (route.query.x) {
        const decoded = decode(route.query.x as string);

        const decodedAbility = abilities.value.find(
          (ability) => ability.name === decoded,
        ) as Ability;
        if (itemToGuess.value.abilityUnlimited?.name !== decodedAbility.name) {
          itemToGuess.value.abilityUnlimited = decodedAbility;
          guessedItems.value.abilityUnlimited = [];
          attempts.value.abilityUnlimited = defaultAttempts;
        }
      }
      if (!itemToGuess.value.abilityUnlimited) {
        itemToGuess.value.abilityUnlimited = abilities.value[
          Math.floor(Math.random() * abilities.value.length)
        ] as Ability;
      }
    }

    function resetDailyValues() {
      guessedItems.value.classic = [];
      guessedItems.value.ability = [];
      attempts.value.classic = defaultAttempts;
      attempts.value.ability = defaultAttempts;
      selectedMinigameAbility.value.ability = "";
    }

    async function getDaily() {
      //if todays date is the same as the servers date, then I fetch the daily because it is possible for the date to be the same without the daily being fetched
      // if the date isn't the same then I also fetch the
      dailyDate.value =
        (route.query.date as string) ?? format(new Date(), "yyyy-MM-dd");

      if (currentDailyDate.value !== dailyDate.value) {
        resetDailyValues();
        currentDailyDate.value = dailyDate.value;
      }
      try {
        const { daily: data } = await $fetch(
          `/api/daily?date=${dailyDate.value}`,
        );
        itemToGuess.value.classic =
          warframes.find((warframe) => warframe === data.classicId) ?? null;
        itemToGuess.value.ability = abilities.value.find(
          (ability) => ability.name === data.abilityId,
        ) as Ability;
        currentDay.value = data.day;
      } catch (error) {
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to fetch daily",
          data: error,
        });
      }
    }

    const mode = useGameMode();

    const { proxy } = useScriptUmamiAnalytics();
    function resetGame() {
      if (!mode.value) throw createError("Mode not set");
      attempts.value[mode.value] = 6;
      guessedItems.value[mode.value] = [];

      proxy.track("started new game", { mode: mode.value });

      if (mode.value === "classicUnlimited") {
        router.replace({ query: { mode: "unlimited", x: undefined } });
        itemToGuess.value.classicUnlimited =
          warframes[Math.floor(Math.random() * warframes.length)] ?? null;
      }
      if (mode.value === "abilityUnlimited") {
        router.replace({ query: { mode: "unlimited", x: undefined } });
        itemToGuess.value.abilityUnlimited = abilities.value[
          Math.floor(Math.random() * abilities.value.length)
        ] as Ability;
        selectedMinigameAbility.value.abilityUnlimited = "";
      }
    }

    const abilities = computed(() =>
      Object.values(warframeData).flatMap((warframe) =>
        warframe.abilities.map((ability) => ({
          ...ability,
          belongsTo: warframe.name,
        })),
      ),
    );

    const vanillaWarframes = computed(() =>
      Object.values(warframeData).filter(
        (warframe) => warframe.variant === "Standard",
      ),
    );

    const version = ref(1);

    return {
      warframes,
      attempts,
      itemToGuess,
      guessedItems,
      dailyDate,
      defaultAttempts,
      abilities,
      currentDailyDate,
      currentDay,
      vanillaWarframes,
      selectedMinigameAbility,
      version,
      classicInit,
      abilityInit,
      getDaily,
      resetGame,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: [
        "guessedItems",
        "attempts",
        "itemToGuess",
        "dailyDate",
        "currentDailyDate",
        "selectedMinigameAbility",
        "version",
      ],
    },
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot));
}
