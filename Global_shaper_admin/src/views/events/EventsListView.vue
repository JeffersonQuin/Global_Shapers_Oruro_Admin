<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useEventsStore } from '@/stores/events.store'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/composables/useSlug'

const store = useEventsStore()
const router = useRouter()
const toast = useToast()

const statusFilter = ref('')
const categoryFilter = ref('')
const page = ref(1)
const perPage = 10

const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'completed', label: 'Completado' },
]
const categoryOptions = computed(() => store.categories.map((c) => ({ value: c.id, label: c.name })))

const filtered = computed(() =>
  store.items.filter(
    (e) =>
      (!statusFilter.value || e.status === statusFilter.value) &&
      (!categoryFilter.value || e.category_id === categoryFilter.value),
  ),
)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

const locationLabels: Record<string, string> = { physical: 'Presencial', virtual: 'Virtual', hybrid: 'Híbrido' }

const toDelete = ref<string | null>(null)
async function confirmDelete() {
  const id = toDelete.value
  if (!id) return
  await toast.attempt(() => store.remove(id), 'Evento eliminado')
  toDelete.value = null
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Eventos</h1>
      <div style="display: flex; gap: 0.5rem">
        <AppButton variant="secondary" @click="router.push('/events/categories')">Categorías</AppButton>
        <AppButton @click="router.push('/events/new')">+ Nuevo evento</AppButton>
      </div>
    </div>

    <div class="filters">
      <AppSelect v-model="statusFilter" label="Estado" :options="statusOptions" placeholder="Todos" />
      <AppSelect v-model="categoryFilter" label="Categoría" :options="categoryOptions" placeholder="Todas" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoría</th>
            <th>Inicio</th>
            <th>Lugar</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in paged" :key="e.id">
            <td>{{ e.title }}</td>
            <td>{{ store.categoryName(e.category_id) }}</td>
            <td>{{ formatDateTime(e.start_datetime) }}</td>
            <td>{{ locationLabels[e.location_type] }}</td>
            <td><StatusBadge :status="e.status" /></td>
            <td>
              <div class="actions-cell">
                <AppButton size="sm" variant="secondary" @click="router.push(`/events/${e.id}/edit`)">Editar</AppButton>
                <AppButton size="sm" variant="danger" @click="toDelete = e.id">Eliminar</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay eventos todavía. Crea el primero.</div>
      <AppPagination v-model:page="page" :total-pages="totalPages" />
    </div>

    <AppModal
      :show="!!toDelete"
      title="Eliminar evento"
      message="¿Seguro que deseas eliminar este evento?"
      confirm-text="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
