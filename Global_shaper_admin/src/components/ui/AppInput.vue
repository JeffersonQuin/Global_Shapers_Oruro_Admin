<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string | number | undefined
  type?: string
  required?: boolean
  error?: string
  placeholder?: string
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="field" :class="{ 'has-error': error }">
    <label v-if="label">
      {{ label }} <span v-if="required" class="req">*</span>
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>
