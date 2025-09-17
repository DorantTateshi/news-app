<template>
  <div :class="cardClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { cn } from "~/lib/utils";

const attrs = useAttrs();

const cardClasses = computed(() =>
  cn(
    "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm",
    attrs.class as string
  )
);

defineOptions({
  inheritAttrs: false,
});
</script>
