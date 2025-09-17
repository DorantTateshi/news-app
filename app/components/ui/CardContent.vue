<template>
  <div :class="contentClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { cn } from "~/lib/utils";

const attrs = useAttrs();

const contentClasses = computed(() => cn("p-6 pt-0", attrs.class as string));

defineOptions({
  inheritAttrs: false,
});
</script>
