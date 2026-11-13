<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInboxStore } from '@/stores/inbox.store'
import { formatDateTime } from '@/composables/useSlug'

const store = useInboxStore()
const router = useRouter()

const statusFilter = ref('')
const categoryFilter = ref('')
const priorityFilter = ref('')

const statusOptions = [
  { value: 'submitted', label: 'Enviada' },
  { value: 'under_review', label: 'En revisión' },
  { value: 'accepted', label: 'Aceptada' },
  { value: 'declined', label: 'Rechazada' },
  { value: 'implemented', label: 'Implementada' },
]
const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]
const categoryOptions = computed(() =>
  store.proposalCategories.map((c) => ({ value: c.id, label: c.name })),
)

const filtered = computed(() =>
  [...store.proposals]
    .filter(
      (p) =>
        (!statusFilter.value || p.status === statusFilter.value) &&
        (!categoryFilter.value || p.category_id === categoryFilter.value) &&
        (!priorityFilter.value || p.priority_level === priorityFilter.value),
    )
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Propuestas comunitarias</h1>
      <AppButton variant="secondary" @click="router.push('/inbox/proposals/categories')">
        Gestionar categorías
      </AppButton>
    </div>

    <div class="filters">
      <AppSelect v-model="statusFilter" label="Estado" :options="statusOptions" placeholder="Todos" />
      <AppSelect v-model="priorityFilter" label="Prioridad" :options="priorityOptions" placeholder="Todas" />
      <AppSelect v-model="categoryFilter" label="Categoría" :options="categoryOptions" placeholder="Todas" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Problema</th>
            <th>Remitente</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.id"
            :class="{ 'row-unread': p.status === 'submitted' }"
            style="cursor: pointer"
            @click="router.push(`/inbox/proposals/${p.id}`)"
          >
            <td>{{ p.problem_title }}</td>
            <td>{{ p.submitter_name }}</td>
            <td>{{ store.proposalCategoryName(p.category_id) }}</td>
            <td><StatusBadge v-if="p.priority_level" :status="p.priority_level" /><span v-else>—</span></td>
            <td><StatusBadge :status="p.status" /></td>
            <td>{{ formatDateTime(p.submitted_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay propuestas.</div>
    </div>
  </div>
</template>
