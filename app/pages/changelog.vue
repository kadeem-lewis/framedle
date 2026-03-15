<script setup lang="ts">
definePageMeta({
  layout: "content",
});

useSeoMeta({
  title: "Changelog",
  ogTitle: "Framedle Changelog",
  description:
    "See a history of all the updates made to Framedle since its launch and the latest added features.",
  ogDescription:
    "See a history of all the updates made to Framedle since its launch and the latest added features.",
});

const versions = [
  {
    title: "1.3.0",
    date: "2026-03-15",
    content: `
### Features

- Add a contact form to the website for users to submit feedback and report bugs
- Add a changelog page and an faq page to the game to answer user questions and keep them informed

### Changes

- Changed the colors used in app to be more consistent
- Updated the look of different buttons and components in the app to be closer to Warframe's design style
- Added signature weapon and unique rolling animation as new grid game categories
- Added icons to links to indicate if they go to an external site

### Bug Fixes

- Fixed images not having defined width and height attributes
- Fixed some cards disappearing from legacy game stats when the game mode is unlimited
- Fixed some colors changing when using colorblind mode that should be consistent across all modes
`,
    badge: "v1.3.0",
  },
  {
    title: "1.2.3",
    date: "2026-02-21",
    content: `
### Fixes

- Fixed share stats button not working in classic and ability game modes
`,
    badge: "v1.2.3",
  },
  {
    title: "1.2.2",
    date: "2026-02-20",
    content: `
### Fixes

- Fixed share stats button not working in grid game mode
- Properly fixed average score in grid game not being rounded to 2 decimal places`,
    badge: "v1.2.2",
  },
  {
    title: "v1.2.1",
    date: "2026-02-18",
    content: `
### Fixes
- Fixed game ending prematurely if incorrect guess was made on the last cell in the grid even if attempts were remaining
- Fixed average score in grid game not being rounded to 2 decimal places`,
    badge: "v1.2.1",
  },
  {
    title: "v1.2.0",
    date: "2026-02-17",
    content: `
### Changes

- Added Invisibility as new category to grid game mode

### Fixes

- Fixed multiple warframes being missing from newly generated categories`,
    badge: "v1.2.0",
  },
  {
    title: "v1.1.1",
    date: "2026-02-15",
    content: `
### Changes
- Various performance and background improvements to app`,
    badge: "v1.1.1",
  },
  {
    title: "v1.1.0",
    date: "2026-02-13",
    content: `
### Changes

- Add new categories to grid game mode such as "Warframes that restore energy" and "Warframes with Deluxe skins"

### Fixes

- Fixed an issue where classic and ability dailies would not use some warframes as potential answers
- Fixed stats resetting to previous values after completing a game
    `,
    badge: "v1.1.0",
  },
  {
    title: "v1.0.1",
    date: "2026-01-17",
    content: `
### Fixes
- Fixed game over navigation not working for legacy daily modes
`,
    badge: "v1.0.1",
  },
  {
    title: "v1.0.0",
    date: "2026-01-17",
    content: `
### Features

- Added Grid Game Mode
- Add ability to see how many people won classic and ability games and their average score
- Added community stats to grid game mode of how many people have played each day, the average score and a breakdown of the most and least guessed warframes
- Add web share support for supported browsers when sharing game results
- Add links to quick share game results to popular social media platforms such as Twitter, Bluesky and Whatsapp

### Fixes

- Fixed Excalibur Umbra being missing from game
- Fixed shared classic game results not including playstyle category
- Fixed games registering as won multiple times when reloading or switching modes after completion
`,
    badge: "v1.0.0",
  },
  {
    title: "v0.3.5",
    date: "2025-12-19",
    content: `
### Fixes
- Fixed bug where new daily game would not load
`,
    badge: "v0.3.5",
  },
  {
    title: "v0.3.4",
    date: "2025-12-18",
    content: `
### Fixes
- Fixed an issue where classic and ability dailies would not use some warframes as potential answers
    `,
    badge: "v0.3.4",
  },
  {
    title: "v0.3.3",
    date: "2025-12-17",
    content: `
### Fixes
- Added Gyre Prime and Uriel to the game`,
    badge: "v0.3.3",
  },
  {
    title: "v0.3.2",
    date: "2025-11-10",
    content: `
### Fixes
- Fixed the game not loading when trying to access an unlimited game that was shared
- Fixed the data in shared dailies showing as NaN instead of the actual date
    `,
    badge: "v0.3.2",
  },
  {
    title: "v0.3.1",
    date: "2025-11-09",
    content: `
### Fixes
- Fixed stats migration banner still showing even after migrating stats
`,
    badge: "v0.3.1",
  },
  {
    title: "v0.3.0",
    date: "2025-11-09",
    content: `
### Features
- User streak nows shows on the card for each mode
- Added icons to feedback tiles to make it easier to tell the state of the feedback
- Added a navigation buttons on the game over screen to cycle through previous archive games
- Added section to archive page to show stats for completed, in-progress, and not started games
- Added "Random" button to archive page to navigate to a random past archive game
- Added new "Playstyle" column to classic mode to show warframe playstyle (e.g., Damage, Support, Stealth etc.)

### Changes
- Changed daily warframe selection to not use the same warframe again until all other warframes have been used
- Added Nokko to the game
- Changed urls for games so each daily game and each mode is it's own page
- Changed archive games to store their own data and not reset when switching between archive days
- Updated Site Logo!
    `,
    badge: "v0.3.0",
  },
  {
    title: "v0.2.4",
    date: "2025-09-03",
    content: `
### Changes
- Added Caliban Prime to the game
`,
    badge: "v0.2.4",
  },
  {
    title: "v0.2.3",
    date: "2025-06-27",
    content: `
### Changes
- Added Oraxia to the game
`,
    badge: "v0.2.3",
  },
  {
    title: "v0.2.2",
    date: "2025-06-03",
    content: `
### Changes
- Added Yareli Prime to the game
    `,
    badge: "v0.2.2",
  },
  {
    title: "v0.2.1",
    date: "2025-05-05",
    content: `
### Fixes
- Fixed game returning to the home page when reloading the page
    `,
    badge: "v0.2.1",
  },
  {
    title: "v0.2.0",
    date: "2025-05-04",
    content: `
### Features
- Added an additional column to the classic game mode that shows the warframe variant
- Added tooltips to classic mode headings to show possible values
- Updated ability mode to start with image rotate to increase difficulty
- Add a mini game to guess the ability name after the image is revealed

### Changes
- Changed daily mode refresh to trigger when navigating between game modes
- Updated game instructions

### Fixes
- Fixed game returning to the home page when reloading the page
- Fixed error where clicking on the next mode button would cause the daily mode button to link to previous game mode
    `,
    badge: "v0.2.0",
  },
  {
    title: "v0.1.4",
    date: "2025-04-18",
    content: `
### Fixes
- Fixed an issue where confetti would briefly show when directly navigating between game modes 
`,
    badge: "v0.1.4",
  },
  {
    title: "v0.1.3",
    date: "2025-04-15",
    content: `
### Features
- Updated Warframe search to automatically select the warframe whose name matches the input
### Changes
- Changed the way feedback was displayed that prevented it from working on older devices
`,
    badge: "v0.1.3",
  },
  {
    title: "v0.1.2",
    date: "2025-04-15",
    content: `
### Fixes
- Fixed Koumei having an incorrect progenitor element`,
    badge: "v0.1.2",
  },
  {
    title: "v0.1.1",
    date: "2025-04-10",
    content: `
### Fixes
- Fixed a bug where the share grid for the classic mode would show the wrong state for release date`,
    badge: "v0.1.1",
  },
  {
    title: "v0.1.0",
    date: "2025-04-10",
    content: "Initial release of Framedle",
    badge: "v0.1.0",
  },
];
</script>
<template>
  <div class="flex h-full min-h-0 flex-col gap-4">
    <h1 class="font-roboto text-xl font-semibold text-highlighted">
      Change log
    </h1>
    <div class="h-full min-h-0 overflow-y-auto">
      <UChangelogVersions
        :indicator="false"
        :versions="versions"
        :ui="{
          container: 'gap-y-6 sm:gap-y-6 lg:gap-y-6',
        }"
      >
        <template #body="{ version }">
          <MDC :value="version.content" />
        </template>
      </UChangelogVersions>
    </div>
  </div>
</template>
