<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const LABELS: Record<string, string> = {
  planned: 'Planificada', active: 'Activa', completed: 'Completada', paused: 'Pausada',
  draft: 'Borrador', published: 'Publicado', cancelled: 'Cancelado',
  open: 'Abierta', closed: 'Cerrada',
  unread: 'No leído', read: 'Leído', replied: 'Respondido', archived: 'Archivado',
  pending: 'Pendiente', contacted: 'Contactado', accepted: 'Aceptado', declined: 'Rechazado',
  submitted: 'Enviada', under_review: 'En revisión', implemented: 'Implementada',
  low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente',
}

const COLORS: Record<string, string> = {
  planned: '#64748b', active: '#10b981', completed: '#3b82f6', paused: '#f59e0b',
  draft: '#64748b', published: '#10b981', cancelled: '#ef4444',
  open: '#10b981', closed: '#64748b',
  unread: '#ef4444', read: '#3b82f6', replied: '#10b981', archived: '#64748b',
  pending: '#f59e0b', contacted: '#3b82f6', accepted: '#10b981', declined: '#ef4444',
  submitted: '#f59e0b', under_review: '#3b82f6', implemented: '#10b981',
  low: '#10b981', medium: '#f59e0b', high: '#f97316', urgent: '#ef4444',
}

const label = computed(() => LABELS[props.status] ?? props.status)
const color = computed(() => COLORS[props.status] ?? '#64748b')
</script>

<template>
  <span class="badge" :style="{ background: color + '22', color: color }">{{ label }}</span>
</template>
