<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useChatbotStore } from '@/stores/chatbot.store'
import { useToast } from '@/composables/useToast'

const store = useChatbotStore()
const router = useRouter()
const toast = useToast()

const typeFilter = ref('')
const activeFilter = ref('')

const typeOptions = [
  { value: 'faq', label: 'FAQ' },
  { value: 'about', label: 'Acerca de' },
  { value: 'initiative', label: 'Iniciativa' },
  { value: 'event', label: 'Evento' },
  { value: 'opportunity', label: 'Oportunidad' },
  { value: 'general', label: 'General' },
]
const typeLabels: Record<string, string> = Object.fromEntries(typeOptions.map((o) => [o.value, o.label]))
const activeOptions = [
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
]

const filtered = computed(() =>
  [...store.items]
    .filter(
      (i) =>
        (!typeFilter.value || i.content_type === typeFilter.value) &&
        (!activeFilter.value || String(i.is_active) === activeFilter.value),
    )
    .sort((a, b) => b.priority - a.priority),
)

const toDelete = ref<string | null>(null)
async function confirmDelete() {
  const id = toDelete.value
  if (!id) return
  await toast.attempt(() => store.remove(id), 'Entrada eliminada')
  toDelete.value = null
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Base de conocimiento del chatbot</h1>
      <AppButton @click="router.push('/chatbot/new')">+ Nueva entrada</AppButton>
    </div>

    <div class="filters">
      <AppSelect v-model="typeFilter" label="Tipo" :options="typeOptions" placeholder="Todos" />
      <AppSelect v-model="activeFilter" label="Estado" :options="activeOptions" placeholder="Todas" />
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Activa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in filtered" :key="i.id">
            <td>{{ i.title }}</td>
            <td>{{ i.content_type ? typeLabels[i.content_type] : '—' }}</td>
            <td>{{ i.category || '—' }}</td>
            <td>{{ i.priority }}</td>
            <td>{{ i.is_active ? 'Sí' : 'No' }}</td>
            <td>
              <div class="actions-cell">
                <AppButton size="sm" variant="secondary" @click="router.push(`/chatbot/${i.id}/edit`)">Editar</AppButton>
                <AppButton size="sm" variant="danger" @click="toDelete = i.id">Eliminar</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">No hay entradas todavía. Crea la primera.</div>
    </div>

    <AppModal
      :show="!!toDelete"
      title="Eliminar entrada"
      message="¿Seguro que deseas eliminar esta entrada de la base de conocimiento?"
      confirm-text="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
