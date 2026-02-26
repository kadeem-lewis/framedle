<script setup lang="ts">
const { openDialog } = useDialog();
</script>
<template>
  <header
    class="w-full border-b-2 border-neutral-500 py-2 dark:border-neutral-700"
  >
    <UContainer class="flex items-center justify-between">
      <div>
        <h1 class="font-ailerons flex flex-row gap-2 text-[42px] leading-none">
          <NuxtLink to="/" aria-label="Back to home">
            <TheLogo />
          </NuxtLink>
        </h1>
      </div>
      <div class="flex items-center gap-1">
        <UButton
          aria-label="settings"
          icon="i-heroicons-cog-6-tooth-solid"
          variant="outline"
          square
          class="group hover:border-primary dark:border-primary border-b-4 border-neutral-800"
          :ui="{
            leadingIcon: 'group-hover:rotate-45 transition-transform',
          }"
          @click="openDialog(dialogOptions.SETTINGS)"
        />
        <ThemeToggle />
      </div>
    </UContainer>
  </header>
</template>
