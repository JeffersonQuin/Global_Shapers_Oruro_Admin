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
  { value: 'pending', label: 'Pendiente' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'accepted', label: 'Aceptado' },
  { value: 'declined', label: 'Rechazado' },
  { value: 'archived', label: 'Archivado' },
]

const filtered = computed(() =>
  [...store.participation]
    .filter((p) => !statusFilter.value || p.status === statusFilter.value)
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Solicitudes de participación</h1>
    </div>

    <div class="filters">
      <AppSelect v-model="statusFilter" label="Estado" :options="statusOptions" placeholder="Todos" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Enviada</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.id"
            :class="{ 'row-unread': p.status === 'pending' }"
            style="cursor: pointer"
            @click="router.push(`/inbox/participation/${p.id}`)"
          >
            <td>{{ p.full_name }}</td>
            <td>{{ p.email }}</td>
            <td><StatusBadge :status="p.status" /></td>
            <td>{{ formatDateTime(p.submitted_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay solicitudes.</div>
    </div>
  </div>
</template>
