<template>
  <div
    class="flex h-dvh flex-col items-center justify-between gap-4 overflow-hidden"
  >
    <TheNavbar class="shrink-0" />

    <UContainer class="flex min-h-0 w-full flex-1 flex-col">
      <main class="flex min-h-0 flex-1 flex-col">
        <NuxtPage />
      </main>
    </UContainer>

    <UContainer class="shrink-0">
      <TheFooter />
    </UContainer>
  </div>
</template>
