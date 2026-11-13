<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInboxStore } from '@/stores/inbox.store'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/composables/useSlug'
import type { MessageStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useInboxStore()
const toast = useToast()

const id = computed(() => route.params.id as string)
const message = computed(() => store.getMessage(id.value))

const notes = ref('')
const statusOptions = [
  { value: 'unread', label: 'No leído' },
  { value: 'read', label: 'Leído' },
  { value: 'replied', label: 'Respondido' },
  { value: 'archived', label: 'Archivado' },
]

onMounted(() => {
  store.markRead(id.value)
  notes.value = message.value?.admin_notes ?? ''
})

function changeStatus(value: string) {
  const status = value as MessageStatus
  const patch: Record<string, unknown> = { status }
  if (status === 'replied') patch.replied_at = new Date().toISOString()
  store.updateMessage(id.value, patch)
  toast.success('Estado actualizado')
}

function saveNotes() {
  store.updateMessage(id.value, { admin_notes: notes.value })
  toast.success('Notas guardadas')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <AppButton variant="ghost" @click="router.push('/inbox/messages')">‹ Volver</AppButton>
    </div>

    <div v-if="message" class="surface detail">
      <div class="detail-head">
        <div>
          <h1>{{ message.subject }}</h1>
          <p class="meta">
            De <strong>{{ message.sender_name }}</strong> ({{ message.sender_email }})
          </p>
          <p class="meta">{{ formatDateTime(message.sent_at) }}</p>
        </div>
        <StatusBadge :status="message.status" />
      </div>

      <div class="body">{{ message.message }}</div>

      <div class="controls">
        <AppSelect
          :model-value="message.status"
          label="Cambiar estado"
          :options="statusOptions"
          @update:model-value="changeStatus"
        />
        <div class="field">
          <label>Notas internas</label>
          <textarea v-model="notes" rows="3"></textarea>
        </div>
        <AppButton @click="saveNotes">Guardar notas</AppButton>
      </div>
    </div>
    <div v-else class="empty-state">Mensaje no encontrado.</div>
  </div>
</template>

<style scoped>
.detail {
  padding: 1.5rem;
  max-width: 720px;
}
.detail-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.meta {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
.body {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 1rem;
  margin: 1rem 0;
  white-space: pre-wrap;
  line-height: 1.6;
}
.controls {
  max-width: 320px;
}
</style>
