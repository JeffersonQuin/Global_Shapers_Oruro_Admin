<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false },
)
</script>

<template>
  <button class="btn" :class="[`btn-${variant}`, `btn-${size}`]" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
