<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSelect from '@/components/ui/AppSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInboxStore } from '@/stores/inbox.store'
import { formatDateTime } from '@/composables/useSlug'

const store = useInboxStore()
const router = useRouter()

const statusFilter = ref('')
const statusOptions = [
  { value: 'unread', label: 'No leído' },
  { value: 'read', label: 'Leído' },
  { value: 'replied', label: 'Respondido' },
  { value: 'archived', label: 'Archivado' },
]

const filtered = computed(() =>
  [...store.messages]
    .filter((m) => !statusFilter.value || m.status === statusFilter.value)
    .sort((a, b) => b.sent_at.localeCompare(a.sent_at)),
)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Mensajes de contacto</h1>
    </div>

    <div class="filters">
      <AppSelect v-model="statusFilter" label="Estado" :options="statusOptions" placeholder="Todos" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Remitente</th>
            <th>Asunto</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in filtered"
            :key="m.id"
            :class="{ 'row-unread': m.status === 'unread' }"
            style="cursor: pointer"
            @click="router.push(`/inbox/messages/${m.id}`)"
          >
            <td>{{ m.sender_name }}</td>
            <td>{{ m.subject }}</td>
            <td><StatusBadge :status="m.status" /></td>
            <td>{{ formatDateTime(m.sent_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay mensajes.</div>
    </div>
  </div>
</template>
