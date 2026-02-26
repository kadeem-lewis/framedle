<template>
  <div class="flex min-h-dvh flex-col items-center justify-between gap-4">
    <TheNavbar />
    <UContainer class="w-full grow">
      <main>
        <NuxtPage />
      </main>
    </UContainer>
    <UContainer>
      <TheFooter />
    </UContainer>
  </div>
</template>
