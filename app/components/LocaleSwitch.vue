<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

const localeIconMap: { [key: string]: number[] } = {
  en: [127482, 127480],
  es: [127466, 127480],
  pt: [127463, 127479],
};

const selectedLocale = ref(locale.value);

watch(selectedLocale, (newValue) => {
  setLocale(newValue);
});
</script>

<template>
  <USelectMenu
    v-model="selectedLocale"
    :options="locales"
    :ui-menu="{
      width: 'w-max',
    }"
    option-attribute="name"
    value-attribute="code"
    class="border-primary dark:border-primary hover:border-primary border-b-4 border-gray-800 bg-gray-100/75 dark:bg-gray-800/75"
  >
    <UButton
      :icon-only="true"
      variant="outline"
      :aria-label="`Switch to ${selectedLocale}`"
    >
      {{ String.fromCodePoint(...localeIconMap[selectedLocale]!) }}
    </UButton>
    <template #option="{ option }">
      <span class="flex w-fit items-center gap-1">
        {{ String.fromCodePoint(...localeIconMap[option.code]!) }}
        {{ option.name }}
      </span>
    </template>
  </USelectMenu>
</template>
