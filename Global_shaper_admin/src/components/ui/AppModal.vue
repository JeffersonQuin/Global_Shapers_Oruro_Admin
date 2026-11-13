<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  danger?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <AppButton variant="secondary" @click="emit('cancel')">Cancelar</AppButton>
        <AppButton :variant="danger ? 'danger' : 'primary'" @click="emit('confirm')">
          {{ confirmText || 'Confirmar' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
