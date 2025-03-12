<template>
  <div class="flex h-full w-full items-center justify-center bg-neutral-50">
    <div class="flex h-full w-full flex-col items-center justify-center">
      <h1 class="flex justify-center gap-4 text-[80px] font-black uppercase">
        <span
          v-for="(letter, index) in ['F', 'R', 'A', 'M', 'E', 'D', 'L', 'E']"
          :key="index"
          class="bg-green-500 px-5 py-2"
        >
          {{ letter }}
        </span>
      </h1>
      <p class="mb-0 px-20 pb-10 text-4xl font-bold uppercase">
        A Warframe Guessing Game
      </p>
    </div>
  </div>
</template>
