<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

console.log(locale.value, locales.value);

const localeIconMap: { [key: string]: string } = {
  en: "i-openmoji-flag-united-states",
  es: "i-openmoji-flag-spain",
  pt: "i-openmoji-flag-brazil",
};

const selectedLocale = ref(locale.value);
</script>

<template>
  <USelectMenu
    v-model="selectedLocale"
    :options="locales"
    :ui-menu="{
      width: 'w-fit',
    }"
    option-attribute="name"
    option-value="code"
    disabled
    class="border-primary dark:border-primary hover:border-primary border border-b-4 border-gray-800 bg-gray-100/75 dark:bg-gray-800/75"
  >
    <template #label>
      <UIcon :name="localeIconMap[selectedLocale]!" class="size-5" />
    </template>
    <template #option="{ option }">
      <span class="flex w-fit items-center gap-1">
        <UIcon :name="localeIconMap[option.code]!" />
        {{ option.name }}
      </span>
    </template>
  </USelectMenu>
</template>
