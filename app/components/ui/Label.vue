<template>
  <label :class="labelClasses" v-bind="$attrs">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { cn } from "~/lib/utils";

const attrs = useAttrs();

const labelClasses = computed(() =>
  cn(
    "block text-sm font-medium text-gray-700 mb-1",
    attrs.class as string
  )
);

defineOptions({
  inheritAttrs: false,
});
</script>
