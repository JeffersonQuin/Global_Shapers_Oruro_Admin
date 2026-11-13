<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInboxStore } from '@/stores/inbox.store'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/composables/useSlug'
import type { ProposalStatus, PriorityLevel } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useInboxStore()
const toast = useToast()

const id = computed(() => route.params.id as string)
const item = computed(() => store.getProposal(id.value))
const notes = ref('')

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

onMounted(() => {
  notes.value = item.value?.admin_notes ?? ''
})

function changeStatus(value: string) {
  store.updateProposal(id.value, { status: value as ProposalStatus })
  toast.success('Estado actualizado')
}
function changePriority(value: string) {
  store.updateProposal(id.value, { priority_level: value as PriorityLevel })
  toast.success('Prioridad actualizada')
}
function saveNotes() {
  store.updateProposal(id.value, { admin_notes: notes.value })
  toast.success('Notas guardadas')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <AppButton variant="ghost" @click="router.push('/inbox/proposals')">‹ Volver</AppButton>
    </div>

    <div v-if="item" class="surface detail">
      <div class="detail-head">
        <h1>{{ item.problem_title }}</h1>
        <StatusBadge :status="item.status" />
      </div>

      <dl class="info">
        <div><dt>Remitente</dt><dd>{{ item.submitter_name }}</dd></div>
        <div><dt>Email</dt><dd>{{ item.submitter_email }}</dd></div>
        <div><dt>Teléfono</dt><dd>{{ item.submitter_phone || '—' }}</dd></div>
        <div><dt>Categoría</dt><dd>{{ store.proposalCategoryName(item.category_id) }}</dd></div>
        <div><dt>Área geográfica</dt><dd>{{ item.geographic_area || '—' }}</dd></div>
        <div><dt>Enviada</dt><dd>{{ formatDateTime(item.submitted_at) }}</dd></div>
      </dl>

      <div class="block">
        <strong>Descripción del problema</strong>
        <p>{{ item.problem_description }}</p>
      </div>
      <div v-if="item.proposed_solution" class="block">
        <strong>Solución propuesta</strong>
        <p>{{ item.proposed_solution }}</p>
      </div>

      <div class="controls">
        <AppSelect
          :model-value="item.status"
          label="Cambiar estado"
          :options="statusOptions"
          @update:model-value="changeStatus"
        />
        <AppSelect
          :model-value="item.priority_level ?? ''"
          label="Prioridad"
          :options="priorityOptions"
          placeholder="Sin prioridad"
          @update:model-value="changePriority"
        />
        <div class="field">
          <label>Notas internas</label>
          <textarea v-model="notes" rows="3"></textarea>
        </div>
        <AppButton @click="saveNotes">Guardar notas</AppButton>
      </div>
    </div>
    <div v-else class="empty-state">Propuesta no encontrada.</div>
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
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}
.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  margin-bottom: 1.25rem;
}
.info dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
.info dd {
  font-size: 0.92rem;
}
.block {
  margin-bottom: 1.25rem;
}
.block p {
  margin-top: 0.4rem;
  line-height: 1.6;
}
.controls {
  max-width: 320px;
}
@media (max-width: 560px) {
  .info {
    grid-template-columns: 1fr;
  }
}
</style>
