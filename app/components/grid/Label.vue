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
      content: 'rounded-none max-w-96',
    }"
  >
    <UButton variant="ghost" class="flex min-h-28 rounded-none">
      <div class="flex w-full flex-col items-center gap-0.5">
        <p class="text-toned text-xs font-semibold uppercase">
          {{ categoryInfo?.header }}
        </p>
        <NuxtImg
          v-if="categoryInfo?.imgSrc"
          format="avif"
          :src="categoryInfo.imgSrc"
          :alt="categoryInfo?.value"
          class="size-8"
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
        <ul v-if="categoryInfo?.extra">
          <li
            v-for="(item, index) in categoryInfo.extra"
            :key="index"
            class="flex items-center gap-1 break-keep"
          >
            <span>■</span>
            <span>
              {{ item }}
            </span>
          </li>
        </ul>
      </div>
    </template>
  </UPopover>
</template>
