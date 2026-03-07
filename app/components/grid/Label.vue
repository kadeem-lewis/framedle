<script setup lang="ts">
import { getCategoryDisplay } from "#shared/data/categoryMetadata";
import { getKeyValueFromId } from "#shared/utils/grid";

const { category } = defineProps<{
  category: string;
}>();

const { key, value } = getKeyValueFromId(category);

const categoryInfo = computed(() => getCategoryDisplay(key, value));

getCategoryDisplay(key, value);
</script>
<template>
  <UPopover
    :ui="{
      content: 'max-w-96 rounded-none',
    }"
  >
    <UButton variant="ghost" class="flex min-h-28 rounded-none">
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-0.5"
      >
        <p class="text-xs font-semibold text-toned uppercase">
          {{ categoryInfo?.header }}
        </p>
        <NuxtImg
          v-if="categoryInfo?.imgSrc"
          format="avif"
          :src="categoryInfo.imgSrc"
          :alt="categoryInfo?.value"
          height="32"
          width="32"
          :class="{
            'dark:invert': categoryInfo.header === 'Aura',
            'invert dark:invert-0': categoryInfo.header === 'Playstyle',
          }"
        />
        <p :class="[categoryInfo?.cssClass]">
          {{ categoryInfo?.value }}
        </p>
      </div>
    </UButton>
    <template #content>
      <div class="p-2">
        <p class="p-2">{{ categoryInfo?.description }}</p>
        <ul v-if="categoryInfo?.extra" class="list-[square] pl-5">
          <li
            v-for="(item, index) in categoryInfo.extra"
            :key="index"
            class="break-keep"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </template>
  </UPopover>
</template>
