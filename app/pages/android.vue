<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Android Testing",
  description:
    "Join the Framedle Android testing program and help us improve the app before its official release on the Google Play Store.",
});
</script>
<template>
  <div class="space-y-6">
    <h2 class="text-center text-xl font-semibold uppercase">
      Help Test Framedle!
    </h2>
    <div class="space-y-4">
      <p>
        If you would like to download the Framedle Android app then you can do
        so by following the steps below.
      </p>
      <p>
        Framedle is currently in the closed testing phase on Android until a
        certain number of users have signed up to test the app during the closed
        test.
      </p>
      <p class="text-center text-lg font-semibold">Directions to Join</p>
      <ol class="list-decimal space-y-2 pl-5">
        <li>
          <span>Join the Framedle Testing Google Group</span>
          <ul class="list-[square] pl-5">
            <li>
              <ULink
                to="https://groups.google.com/g/framedle-testing"
                external
                target="_blank"
                class="text-primary hover:text-primary/70 underline"
                >Framedle Testing Google Group</ULink
              >
            </li>
          </ul>
        </li>
        <li>
          <span>Join the closed test using one of the following links:</span>
          <ul class="list-[square] pl-5">
            <li>
              <ULink
                to="https://play.google.com/apps/testing/com.framedle.twa"
                external
                target="_blank"
                class="text-primary hover:text-primary/70 underline"
                >Join on the Web</ULink
              >
            </li>
            <li>
              <ULink
                to="https://play.google.com/store/apps/details?id=com.framedle.twa"
                external
                target="_blank"
                class="text-primary hover:text-primary/70 underline"
                >Join on Android</ULink
              >
            </li>
          </ul>
        </li>
        <li>Install the app and start playing!</li>
      </ol>
    </div>
    <p>
      If you have any questions or feedback, you can send it to
      <ULink
        to="mailto:support@framedle.com"
        class="text-primary hover:text-primary/70 underline"
        >support@framedle.com</ULink
      >.
    </p>
    <p>Your support is greatly appreciated!</p>
  </div>
</template>
