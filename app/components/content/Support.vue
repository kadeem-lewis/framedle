<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div class="space-y-2">
    <p>
      If you would like to support me and the game's development, You can do so
      in any of the following ways
    </p>
    <ul class="list-[square] pl-6">
      <li>
        You can
        <ULink
          to="https://ko-fi.com/redeemr"
          class="text-(--ui-primary) underline"
          external
          target="blank"
          >buy me a coffee</ULink
        >
      </li>
      <li>
        Check out
        <ULink
          to="https://www.youtube.com/@redeemr"
          class="text-(--ui-primary) underline"
          external
          target="blank"
          >my youtube channel</ULink
        >
      </li>
      <li>
        Join
        <ULink
          :to="runtimeConfig.public.discordInvite"
          class="text-(--ui-primary) underline"
          external
          target="blank"
          >my discord server</ULink
        >
      </li>
      <li>
        Send me a random gift in-game:<span
          class="ml-1 rounded-md border bg-neutral-100 px-2 dark:border-neutral-950 dark:bg-neutral-800"
          >Redeemr</span
        >
      </li>
    </ul>
    <p class="font-roboto text-xl font-semibold uppercase">
      Feedback/Questions
    </p>
    <USeparator />
    <p>
      You can provide Feedback or ask Questions in any of the following ways:
    </p>
    <ul class="list-[square] pl-6">
      <li>
        Open an Issue on
        <ULink
          to="https://github.com/kadeem-lewis/framedle/issues"
          class="text-(--ui-primary) underline"
          external
          >Github</ULink
        >
      </li>
      <li>
        Join
        <ULink
          :to="runtimeConfig.public.discordInvite"
          class="text-(--ui-primary) underline"
          external
          target="blank"
          >my discord</ULink
        >
        and leave a message in the framedle feedback channel
      </li>
      <li>
        send me an email at
        <ULink
          href="mailto:support@framedle.com"
          external
          class="text-(--ui-primary) underline"
          >support@framedle.com</ULink
        >
      </li>
    </ul>
  </div>
</template>
