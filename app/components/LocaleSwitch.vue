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
    :items="locales"
    :ui-menu="{
      width: 'w-max',
    }"
    option-attribute="name"
    value-attribute="code"
    class="border-b-4 border-(--ui-primary) border-neutral-800 bg-white/75 hover:border-(--ui-primary) dark:border-(--ui-primary) dark:bg-neutral-900/75"
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
