<template>
  <UContainer
    class="flex min-h-screen flex-col items-center justify-between gap-y-2"
  >
    <SiteNavbar />
    <main class="w-full grow">
      <NuxtPage />
    </main>
    <SiteFooter />
    <UNotifications />
  </UContainer>
</template>

<script setup lang="ts"></script>
