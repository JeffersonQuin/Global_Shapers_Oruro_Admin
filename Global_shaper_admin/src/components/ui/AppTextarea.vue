<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string | undefined
  required?: boolean
  error?: string
  rows?: number
  placeholder?: string
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="field" :class="{ 'has-error': error }">
    <label v-if="label">
      {{ label }} <span v-if="required" class="req">*</span>
    </label>
    <textarea
      :value="modelValue"
      :rows="rows || 4"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>
