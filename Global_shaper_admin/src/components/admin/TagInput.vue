<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[]; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const draft = ref('')

function add() {
  const v = draft.value.trim()
  if (v && !props.modelValue.includes(v)) {
    emit('update:modelValue', [...props.modelValue, v])
  }
  draft.value = ''
}
function removeTag(tag: string) {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag))
}
</script>

<template>
  <div class="field">
    <label v-if="label">{{ label }}</label>
    <div class="tag-input">
      <span v-for="tag in modelValue" :key="tag" class="tag-chip">
        {{ tag }}
        <button type="button" @click="removeTag(tag)">×</button>
      </span>
      <input
        v-model="draft"
        placeholder="Escribe y presiona Enter"
        @keydown.enter.prevent="add"
        @keydown.,.prevent="add"
      />
    </div>
  </div>
</template>
