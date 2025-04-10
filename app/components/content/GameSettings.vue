<script setup lang="ts">
//colorblind mode
const { $colorblindMode } = useNuxtApp();

// theme toggle
const items = [
  {
    label: "light",
    value: "light",
    icon: "i-heroicons-sun-solid",
  },
  {
    label: "dark",
    value: "dark",
    icon: "i-heroicons-moon-solid",
  },
  {
    label: "system",
    value: "system",
    icon: "i-heroicons-computer-desktop",
  },
];

// localizations
const { locale, locales, setLocale } = useI18n();
const selectedLocale = ref(locale.value);

watch(selectedLocale, (newValue) => {
  setLocale(newValue);
});

watchEffect(() => {
  console.log(locales.value);
});

//data transfer
</script>
<template>
  <div class="flex items-center justify-between py-2">
    <p class="text-lg font-medium">Colorblind Mode</p>
    <USwitch v-model="$colorblindMode" @click="$toggleColorblindMode" />
  </div>
  <USeparator />
  <div class="flex items-center justify-between py-2">
    <p class="text-lg font-medium">Theme</p>
    <USelect
      v-model="$colorMode.preference"
      :items="items"
      class="capitalize"
      size="lg"
      :ui="{ base: 'rounded-none ', content: 'rounded-none', value: 'px-2' }"
    >
      <template #item="{ item }">
        <UIcon :name="item.icon" class="size-5" />
        <span class="ml-2">{{ item.label }}</span>
      </template>
    </USelect>
  </div>
  <USeparator />
  <div class="flex flex-col gap-1 py-2">
    <div class="flex items-center justify-between pb-1">
      <p class="text-lg font-medium">Language</p>
      <USelect
        v-model="selectedLocale"
        :items="locales"
        label-key="name"
        value-key="code"
        size="lg"
        :ui="{ base: 'rounded-none ', content: 'rounded-none', value: 'px-2' }"
      />
    </div>
    <p class="text-sm text-(--ui-text-muted)">More languages coming soon</p>
  </div>
  <USeparator />
</template>

<script setup lang="ts">
//colorblind mode
const { $colorblindMode } = useNuxtApp();

// theme toggle
const items = [
  {
    label: "light",
    value: "light",
    icon: "i-heroicons-sun-solid",
  },
  {
    label: "dark",
    value: "dark",
    icon: "i-heroicons-moon-solid",
  },
  {
    label: "system",
    value: "system",
    icon: "i-heroicons-computer-desktop",
  },
];

// localizations
const { locale, locales, setLocale } = useI18n();
const selectedLocale = ref(locale.value);

watch(selectedLocale, (newValue) => {
  setLocale(newValue);
});

watchEffect(() => {
  console.log(locales.value);
});

//data transfer
</script>
