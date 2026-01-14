<script setup lang="ts">
const { MAX_GRID_ATTEMPTS } = useGridGameStore();
</script>
<template>
  <ul class="list-[square] space-y-2 pl-5">
    <li>
      Your goal is to fill the entire grid with valid Warframes while aiming for
      the lowest possible uniqueness score.
    </li>
    <li>
      You have
      <span class="text-highlighted font-semibold">{{
        MAX_GRID_ATTEMPTS
      }}</span>
      attempts to fill out the grid.
    </li>
    <li>
      Select a Warframe for each cell that matches the specified row and column
      criteria.
    </li>
    <li>
      Once you select a Warframe, you can't switch your answer or reuse that
      Warframe.
    </li>
    <li>
      The
      <span class="text-highlighted font-semibold">uniqueness score</span> is
      based on how unique your selected Warframes are vs. other players. The
      lower the score, the better!
    </li>
    <li>
      Uniqueness scores update over time as more players complete the grid.
    </li>
    <li>
      Clicking on a category name will show you additional information about
      that category.
    </li>
    <li>
      A streak is earned by completing the grid on the day it is released. To
      achieve a streak, at least one cell in the grid must be correctly filled.
    </li>
  </ul>
</template>
