<script setup lang="ts">
const { shareText } = useShareText();
const { copy, copied } = useClipboard();
const { share, isSupported } = useShare();

function handleCopy() {
  copy(shareText.value);
}

function handleShare() {
  share({
    title: "Framedle",
    text: shareText.value,
  });
}
</script>
<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center gap-2">
      <UButton
        class="font-semibold uppercase"
        variant="outline"
        icon="i-mdi-content-copy"
        @click="handleCopy"
      >
        {{ !copied ? "Copy" : "Copied" }}
      </UButton>
      <UButton
        v-if="isSupported"
        class="font-semibold uppercase"
        variant="outline"
        icon="i-mdi-share"
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
        :to="`https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`"
      />
      <UButton
        color="neutral"
        icon="my-icon-x"
        size="lg"
        external
        :to="`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`"
      />
      <UButton
        color="success"
        icon="i-mdi-whatsapp"
        size="lg"
        external
        :to="`whatsapp://send?&text=${encodeURIComponent(shareText)}`"
      />
    </div>
  </div>
</template>
