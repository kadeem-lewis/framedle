<script setup lang="ts">
const { t } = useI18n();

const { DEFAULT_ATTEMPTS } = useGameStore();
</script>
<template>
  <div class="space-y-4">
    <p>
      Guess the Warframe the ability belongs to in {{ DEFAULT_ATTEMPTS }} tries
    </p>
    <p>{{ t("instructions.ability.subtitle") }}</p>
    <p>
      Images begin rotated and are placed in the correct orientation as
      additional tiles are revealed
    </p>
    <p>The order in which tiles are revealed may change between days</p>
  </div>
</template>
