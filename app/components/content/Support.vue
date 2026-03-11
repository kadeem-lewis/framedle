<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
<template>
  <div class="flex flex-col gap-2">
    <p>
      If you would like to support me and the game's development, You can do so
      in any of the following ways
    </p>
    <ul class="list-[square] pl-6">
      <li>
        You can
        <UiAppLink :to="runtimeConfig.public.kofiUrl" external target="_blank"
          >buy me a coffee
        </UiAppLink>
      </li>
      <li>
        Check out
        <UiAppLink
          to="https://www.youtube.com/@redeemr"
          external
          target="_blank"
          >my youtube channel</UiAppLink
        >
      </li>
      <li>
        Join
        <UiAppLink
          :to="runtimeConfig.public.discordInvite"
          external
          target="_blank"
          >my discord server</UiAppLink
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
        <UiAppLink
          to="https://github.com/kadeem-lewis/framedle/issues"
          target="_blank"
          external
          >Github</UiAppLink
        >
      </li>
      <li>
        Join
        <UiAppLink
          :to="runtimeConfig.public.discordInvite"
          external
          target="_blank"
          >my discord</UiAppLink
        >
        and leave a message in the framedle feedback channel
      </li>
      <li>
        send me an email at
        <UiAppLink href="mailto:support@framedle.com"
          >support@framedle.com
        </UiAppLink>
      </li>
    </ul>
  </div>
</template>
