<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useOpportunitiesStore } from '@/stores/opportunities.store'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/composables/useSlug'

const store = useOpportunitiesStore()
const router = useRouter()
const toast = useToast()

const typeFilter = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const page = ref(1)
const perPage = 10

const typeOptions = [
  { value: 'call', label: 'Convocatoria' },
  { value: 'volunteer', label: 'Voluntariado' },
  { value: 'workshop', label: 'Taller' },
  { value: 'scholarship', label: 'Beca' },
  { value: 'event', label: 'Evento' },
  { value: 'other', label: 'Otro' },
]
const typeLabels: Record<string, string> = Object.fromEntries(typeOptions.map((o) => [o.value, o.label]))
const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'open', label: 'Abierta' },
  { value: 'closed', label: 'Cerrada' },
]
const categoryOptions = computed(() => store.categories.map((c) => ({ value: c.id, label: c.name })))

const filtered = computed(() =>
  store.items.filter(
    (o) =>
      (!typeFilter.value || o.opportunity_type === typeFilter.value) &&
      (!statusFilter.value || o.status === statusFilter.value) &&
      (!categoryFilter.value || o.category_id === categoryFilter.value),
  ),
)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

const toDelete = ref<string | null>(null)
async function confirmDelete() {
  const id = toDelete.value
  if (!id) return
  await toast.attempt(() => store.remove(id), 'Oportunidad eliminada')
  toDelete.value = null
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Oportunidades</h1>
      <div style="display: flex; gap: 0.5rem">
        <AppButton variant="secondary" @click="router.push('/opportunities/categories')">Categorías</AppButton>
        <AppButton @click="router.push('/opportunities/new')">+ Nueva oportunidad</AppButton>
      </div>
    </div>

    <div class="filters">
      <AppSelect v-model="typeFilter" label="Tipo" :options="typeOptions" placeholder="Todos" />
      <AppSelect v-model="statusFilter" label="Estado" :options="statusOptions" placeholder="Todos" />
      <AppSelect v-model="categoryFilter" label="Categoría" :options="categoryOptions" placeholder="Todas" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Fecha límite</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in paged" :key="o.id">
            <td>{{ o.title }}</td>
            <td>{{ typeLabels[o.opportunity_type] }}</td>
            <td>{{ store.categoryName(o.category_id) }}</td>
            <td><StatusBadge :status="o.status" /></td>
            <td>{{ formatDate(o.application_deadline) }}</td>
            <td>
              <div class="actions-cell">
                <AppButton size="sm" variant="secondary" @click="router.push(`/opportunities/${o.id}/edit`)">Editar</AppButton>
                <AppButton size="sm" variant="danger" @click="toDelete = o.id">Eliminar</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay oportunidades todavía. Crea la primera.</div>
      <AppPagination v-model:page="page" :total-pages="totalPages" />
    </div>

    <AppModal
      :show="!!toDelete"
      title="Eliminar oportunidad"
      message="¿Seguro que deseas eliminar esta oportunidad?"
      confirm-text="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
