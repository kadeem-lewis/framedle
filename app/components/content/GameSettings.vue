<script setup lang="ts">
//colorblind mode
const { $colorblindMode } = useNuxtApp();

// theme
const { showBackground } = storeToRefs(useSettingsStore());

//data transfer
</script>
<template>
  <div>
    <div class="flex flex-col gap-1 py-2">
      <p class="text-lg font-medium">Accessibility</p>
      <UiItem>
        <UiAppSwitch
          v-model="$colorblindMode"
          label="Colorblind Mode"
          size="lg"
          @click="$toggleColorblindMode"
        />
      </UiItem>
    </div>
    <USeparator />
    <div class="flex items-center justify-between py-2">
      <p class="text-lg font-medium">Theme</p>
      <UColorModeSelect
        size="lg"
        class="min-w-fit rounded-none"
        :ui="{
          content: 'rounded-none',
        }"
      />
    </div>
    <USeparator />
    <div class="flex flex-col gap-1 py-2">
      <div class="flex items-center justify-between pb-1">
        <p class="text-lg font-medium">Language</p>
        <USelect
          default-value="English"
          label-key="name"
          value-key="code"
          disabled
          size="lg"
          :ui="{
            base: 'rounded-none',
            content: 'rounded-none',
            value: 'px-2',
          }"
        />
      </div>
      <p class="text-sm text-muted">More languages coming soon</p>
    </div>
    <USeparator />
    <div class="flex flex-col gap-1 py-2">
      <p class="text-lg font-medium">UI</p>
      <UiItem>
        <UiAppSwitch
          v-model="showBackground"
          size="lg"
          label="Show Background"
        />
      </UiItem>
    </div>
  </div>
</template>
