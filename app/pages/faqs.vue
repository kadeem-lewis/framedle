<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";
const items = shallowRef<AccordionItem[]>([
  {
    label: "Q: When do new puzzles come out?",
    content: "New puzzles are released at midnight local time.",
  },
]);
</script>
<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold">Frequently Asked Questions</h2>
    <UAccordion :items />
  </section>
</template>
