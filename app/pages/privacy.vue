<script setup lang="ts">
useSeoMeta({
  title: "Privacy Policy",
});
</script>
<template>
  <div class="flex flex-col gap-2 px-2 pt-2 pb-4">
    <h1 class="text-2xl font-bold">Privacy Policy</h1>
    <p class="italic"><em>Last updated: March 26, 2025</em></p>

    <p>
      This Privacy Policy explains what information we collect, how we use it,
      and what rights you have in relation to your information when you use our
      website and services.
    </p>

    <h2 class="text-xl font-semibold">Information We Collect</h2>
    <p>We collect minimal data to ensure our services function properly:</p>

    <h3 class="text-lg font-semibold">Game Data and User Preferences</h3>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Game progress and statistics (stored locally in your browser)</li>
      <li>Game settings and preferences</li>
      <li>User answers and results</li>
    </ul>

    <h3 class="text-lg font-semibold">Technical Information</h3>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Browser type and version</li>
      <li>Device information and operating system</li>
      <li>Language preferences</li>
      <li>IP address (anonymized)</li>
      <li>General geolocation data (country/region level)</li>
      <li>Referring URLs</li>
      <li>Time and duration of visits</li>
    </ul>

    <h2 class="text-xl font-semibold">How We Use Your Information</h2>
    <p>The data we collect is used exclusively to:</p>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Save your game progress and preferences</li>
      <li>Personalize your experience based on your locale</li>
      <li>Determine appropriate language settings</li>
      <li>Improve game performance and user experience</li>
      <li>Generate anonymous usage statistics</li>
    </ul>

    <h2 class="text-xl font-semibold">How We Store Your Information</h2>

    <h3 class="text-lg font-semibold">Local Storage and Cookies</h3>
    <p>We use browser local storage and cookies to:</p>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Keep track of your game progress and statistics</li>
      <li>Store your preferences and settings</li>
      <li>Remember if you are a returning user</li>
      <li>Enable core game functionality</li>
    </ul>

    <h3 class="text-lg font-semibold">Analytics</h3>
    <p>
      We use Umami, a privacy-focused analytics platform, to collect anonymous
      usage data. This helps us understand how users interact with our site
      without collecting personally identifiable information. Umami respects
      privacy by:
    </p>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Not using cookies for tracking visitors</li>
      <li>Not collecting personal information</li>
      <li>Not sharing your data with third-party services</li>
      <li>Anonymizing all collected data</li>
    </ul>

    <h2 class="text-xl font-semibold">Data Sharing</h2>
    <p>
      We do not sell, trade, or otherwise transfer your information to outside
      parties. We may share anonymous, aggregated statistics about website
      usage, but this will never include information that could identify you
      personally.
    </p>

    <h2 class="text-xl font-semibold">Your Rights and Choices</h2>

    <h3 class="text-lg font-semibold">Managing Your Data</h3>
    <p>You can clear all locally stored game data at any time by:</p>
    <ul class="flex list-[square] flex-col gap-1 pl-4">
      <li>Using your browser's settings to clear local storage and cookies</li>
      <li>Using private/incognito browsing modes to prevent data storage</li>
    </ul>

    <h3 class="text-lg font-semibold">Umami Analytics Data</h3>
    <p>
      The analytics data collected through Umami is completely anonymous and
      cannot be tied to individual users. Because of this anonymization, we
      cannot delete specific user data from our analytics, as there is no way to
      identify which data belongs to which user.
    </p>

    <h2 class="text-xl font-semibold">Changes to This Privacy Policy</h2>
    <p>
      We may update this privacy policy from time to time. We will post any
      changes on this page and encourage you to review our privacy policy
      periodically.
    </p>

    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-semibold">Contact Us</h2>
      <p>
        If you have any questions or concerns about this privacy policy, please
        contact us at:
        <a
          href="mailto:support@framedle.com"
          class="text-(--ui-primary) underline"
          >support@framedle.com</a
        >
      </p>
    </div>
    <USeparator class="pt-2" />
  </div>
</template>
