<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

useSeoMeta({
  title: "Frequently Asked Questions",
  ogTitle: "Framedle Frequently Asked Questions",
  description:
    "Get answers to frequently asked questions about the Warframe puzzle game, Framedle.",
  ogDescription:
    "Get answers to frequently asked questions about the Warframe puzzle game, Framedle.",
});

const items = shallowRef<AccordionItem[]>([
  {
    label: "Q: When do new puzzles come out?",
    content: "New puzzles are released at midnight local time.",
  },
  {
    label: "Q: I want to play more than one game a day, is that possible?",
    content:
      "A: Yes. Every mode available on framedle has both a daily mode and also an unlimited mode that can be played as many times as you want. There is also an archive of every past daily puzzle that you can play at any time.",
  },
  {
    label:
      "Q: I submitted a Warframe that matched the row and column for the grid puzzle but it was marked as incorrect, why?",
    content:
      "A: Most of the data used in this app is gotten from the warframe wiki. It is possible that the data source on the wiki is missing valid warframes or the app just has not done an update since the warframe was added to the wiki. You can always submit a bug report to let me know about the issue and I will try to get it fixed as soon as possible.",
  },
  {
    label: "Q: Will Framedle be available in other languages?",
    content:
      "A: The goal is to make Framedle available in as many languages as possible. I am currently stuck figuring out some of the technical details of doing that so it might take a while, but it is definitely something I want to do.",
  },
  {
    label: "Q: How can I provide feedback or report a bug?",
    content:
      "A: The easiest way to contact me would be through the contact form provided on the site. The form also shows other ways to get in touch.",
  },
]);
</script>
<template>
  <section class="flex flex-col gap-4">
    <h1 class="text-xl font-semibold">Frequently Asked Questions</h1>
    <UAccordion :items />
  </section>
</template>
