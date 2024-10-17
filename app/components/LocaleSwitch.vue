<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

const localeIconMap: { [key: string]: string } = {
  en: "i-openmoji-flag-united-states",
  es: "i-openmoji-flag-spain",
  pt: "i-openmoji-flag-brazil",
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
      width: 'w-fit',
    }"
    option-attribute="name"
    value-attribute="code"
    class="border-primary dark:border-primary hover:border-primary border border-b-4 border-gray-800 bg-gray-100/75 dark:bg-gray-800/75"
  >
    <UButton
      :icon="localeIconMap[selectedLocale]"
      :icon-only="true"
      variant="outline"
      :aria-label="`Switch to ${selectedLocale}`"
    />
    <template #option="{ option }">
      <span class="flex w-fit items-center gap-1">
        <UIcon :name="localeIconMap[option.code]!" />
        {{ option.name }}
      </span>
    </template>
  </USelectMenu>
</template>
