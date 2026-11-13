<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInitiativesStore } from '@/stores/initiatives.store'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/composables/useSlug'

const store = useInitiativesStore()
const router = useRouter()
const toast = useToast()

const statusFilter = ref('')
const categoryFilter = ref('')
const page = ref(1)
const perPage = 10

const statusOptions = [
  { value: 'planned', label: 'Planificada' },
  { value: 'active', label: 'Activa' },
  { value: 'completed', label: 'Completada' },
  { value: 'paused', label: 'Pausada' },
]
const categoryOptions = computed(() =>
  store.categories.map((c) => ({ value: c.id, label: c.name })),
)

const filtered = computed(() =>
  store.items.filter(
    (i) =>
      (!statusFilter.value || i.status === statusFilter.value) &&
      (!categoryFilter.value || i.category_id === categoryFilter.value),
  ),
)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

const toDelete = ref<string | null>(null)
async function confirmDelete() {
  const id = toDelete.value
  if (!id) return
  await toast.attempt(() => store.remove(id), 'Iniciativa eliminada')
  toDelete.value = null
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Iniciativas</h1>
      <div style="display: flex; gap: 0.5rem">
        <AppButton variant="secondary" @click="router.push('/initiatives/categories')">
          Categorías
        </AppButton>
        <AppButton @click="router.push('/initiatives/new')">+ Nueva iniciativa</AppButton>
      </div>
    </div>

    <div class="filters">
      <AppSelect
        v-model="statusFilter"
        label="Estado"
        :options="statusOptions"
        placeholder="Todos"
      />
      <AppSelect
        v-model="categoryFilter"
        label="Categoría"
        :options="categoryOptions"
        placeholder="Todas"
      />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Publicada</th>
            <th>Creada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in paged" :key="i.id">
            <td>{{ i.title }}</td>
            <td>{{ store.categoryName(i.category_id) }}</td>
            <td><StatusBadge :status="i.status" /></td>
            <td>{{ i.is_published ? 'Sí' : 'No' }}</td>
            <td>{{ formatDate(i.created_at) }}</td>
            <td>
              <div class="actions-cell">
                <AppButton size="sm" variant="secondary" @click="router.push(`/initiatives/${i.id}/edit`)">
                  Editar
                </AppButton>
                <AppButton size="sm" variant="danger" @click="toDelete = i.id">Eliminar</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">
        No hay iniciativas todavía. Crea la primera.
      </div>
      <AppPagination v-model:page="page" :total-pages="totalPages" />
    </div>

    <AppModal
      :show="!!toDelete"
      title="Eliminar iniciativa"
      message="¿Seguro que deseas eliminar esta iniciativa? Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
