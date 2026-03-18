<script setup lang="ts">
import { format } from "date-fns";

const { shareText, shareAllText } = useShareText();
const { copy, copied } = useClipboard();
const { share, isSupported } = useShare();
const { currentDailyDate } = storeToRefs(useDailiesStore());
const { mode, isUnlimitedMode } = useGameMode();

const isShareAll = ref(false);

const isEvaluating = ref(false);

const resolvedShareAllText = computedAsync(
  async () => {
    if (isShareAll.value) {
      return await shareAllText();
    }
    return "";
  },
  "",
  isEvaluating,
);

const textToShare = computed(() =>
  isShareAll.value ? resolvedShareAllText.value : shareText.value,
);

const forumText = computed(() => {
  return `${textToShare.value}\n\n #framedle #warframe`;
});

function handleCopy() {
  copy(textToShare.value);
}

function handleShare() {
  share({
    title: "Framedle",
    text: textToShare.value,
  });
}

const isCurrentDay = computed(() => {
  const currentMode = mode.value;
  if (!currentMode || isUnlimitedMode(currentMode)) return false;
  const today = format(new Date(), "yyyy-MM-dd");
  return currentDailyDate.value[currentMode] === today;
});
</script>
<template>
  <div class="flex flex-col gap-3">
    <div>
      <USwitch
        v-if="isCurrentDay"
        v-model="isShareAll"
        label="Share all dailies"
      />
    </div>
    <div class="flex justify-center gap-2">
      <UButton
        class="font-semibold"
        variant="tenno"
        icon="i-mdi-content-copy"
        :loading="isEvaluating"
        :disabled="isEvaluating"
        @click="handleCopy"
      >
        {{ !copied ? "Copy" : "Copied" }}
      </UButton>
      <UButton
        v-if="isSupported"
        class="font-semibold uppercase"
        variant="tenno"
        icon="i-mdi-share"
        :loading="isEvaluating"
        :disabled="isEvaluating"
        @click="handleShare"
      >
        Share
      </UButton>
    </div>
    <div class="flex items-center justify-center gap-2">
      <UButton
        color="bluesky"
        icon="my-icon-bluesky"
        size="lg"
        class="text-white"
        external
        :disabled="isEvaluating"
        :to="`https://bsky.app/intent/compose?text=${encodeURIComponent(forumText)}`"
      />
      <UButton
        color="neutral"
        icon="my-icon-x"
        size="lg"
        external
        :disabled="isEvaluating"
        :to="`https://twitter.com/intent/tweet?text=${encodeURIComponent(forumText)}`"
      />
      <UButton
        color="success"
        icon="i-mdi-whatsapp"
        size="lg"
        external
        :disabled="isEvaluating"
        :to="`whatsapp://send?&text=${encodeURIComponent(textToShare)}`"
      />
    </div>
  </div>
</template>
