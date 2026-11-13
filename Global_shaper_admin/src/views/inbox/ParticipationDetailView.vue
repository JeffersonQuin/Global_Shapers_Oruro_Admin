<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import { useInboxStore } from '@/stores/inbox.store'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/composables/useSlug'
import type { ParticipationStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useInboxStore()
const toast = useToast()

const id = computed(() => route.params.id as string)
const item = computed(() => store.getParticipation(id.value))
const notes = ref('')

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'accepted', label: 'Aceptado' },
  { value: 'declined', label: 'Rechazado' },
  { value: 'archived', label: 'Archivado' },
]

onMounted(() => {
  notes.value = item.value?.admin_notes ?? ''
})

function changeStatus(value: string) {
  store.updateParticipation(id.value, { status: value as ParticipationStatus })
  toast.success('Estado actualizado')
}
function saveNotes() {
  store.updateParticipation(id.value, { admin_notes: notes.value })
  toast.success('Notas guardadas')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <AppButton variant="ghost" @click="router.push('/inbox/participation')">‹ Volver</AppButton>
    </div>

    <div v-if="item" class="surface detail">
      <div class="detail-head">
        <h1>{{ item.full_name }}</h1>
        <StatusBadge :status="item.status" />
      </div>

      <dl class="info">
        <div><dt>Email</dt><dd>{{ item.email }}</dd></div>
        <div><dt>Teléfono</dt><dd>{{ item.phone || '—' }}</dd></div>
        <div><dt>Rango de edad</dt><dd>{{ item.age_range || '—' }}</dd></div>
        <div><dt>Cómo nos conoció</dt><dd>{{ item.how_heard_about_us || '—' }}</dd></div>
        <div><dt>Enviada</dt><dd>{{ formatDateTime(item.submitted_at) }}</dd></div>
      </dl>

      <div class="block">
        <strong>Áreas de interés</strong>
        <div class="chips">
          <span v-for="a in item.areas_of_interest" :key="a" class="tag-chip">{{ a }}</span>
        </div>
      </div>

      <div class="block">
        <strong>Razón de interés</strong>
        <p>{{ item.reason_for_interest }}</p>
      </div>

      <div class="controls">
        <AppSelect
          :model-value="item.status"
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
    <div v-else class="empty-state">Solicitud no encontrada.</div>
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
  letter-spacing: 0.03em;
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
.chips {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.4rem;
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
