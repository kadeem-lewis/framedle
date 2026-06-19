<script setup lang="ts"></script>
<template>
  <UAlert
    title="Share to win"
    description="Share your scores on X or Bluesky for a chance to win a Tennocon Digital Pack"
    variant="outline"
    :actions="[
      {
        label: 'Learn More (X)',
        target: '_blank',
        to: 'https://x.com/framedle/status/2067350723604459753',
        class: 'rounded-none',
      },
      {
        label: 'Learn More (Bluesky)',
        color: 'info',
        target: '_blank',
        to: 'https://bsky.app/profile/framedle.com/post/3moj76sasjs2w',
        class: 'rounded-none',
      },
    ]"
    class="rounded-none"
  />
</template>
