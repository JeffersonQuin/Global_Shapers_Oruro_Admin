<script setup lang="ts">
import { computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import { useInitiativesStore } from '@/stores/initiatives.store'
import { useEventsStore } from '@/stores/events.store'
import { useOpportunitiesStore } from '@/stores/opportunities.store'
import { useInboxStore } from '@/stores/inbox.store'
import { formatDateTime } from '@/composables/useSlug'

const initiatives = useInitiativesStore()
const events = useEventsStore()
const opportunities = useOpportunitiesStore()
const inbox = useInboxStore()

const recentMessages = computed(() =>
  [...inbox.messages].sort((a, b) => b.sent_at.localeCompare(a.sent_at)).slice(0, 5),
)
const recentParticipation = computed(() =>
  [...inbox.participation].sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)).slice(0, 5),
)
const recentProposals = computed(() =>
  [...inbox.proposals].sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)).slice(0, 5),
)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>

    <div class="cards-row">
      <AppCard
        label="Iniciativas"
        :value="initiatives.total"
        icon="◆"
        :sub="`${initiatives.publishedCount} publicadas · ${initiatives.draftCount} borrador`"
        accent="#3B82F6"
      />
      <AppCard
        label="Eventos"
        :value="events.total"
        icon="◇"
        :sub="`${events.upcomingCount} próximos · ${events.pastCount} pasados`"
        accent="#8B5CF6"
      />
      <AppCard
        label="Oportunidades"
        :value="opportunities.total"
        icon="★"
        :sub="`${opportunities.openCount} abiertas · ${opportunities.closedCount} cerradas`"
        accent="#F59E0B"
      />
      <AppCard
        label="Mensajes sin leer"
        :value="inbox.unreadMessages"
        icon="✉"
        accent="#EF4444"
      />
      <AppCard
        label="Participación pendiente"
        :value="inbox.pendingParticipation"
        icon="◉"
        accent="#10B981"
      />
      <AppCard
        label="Propuestas pendientes"
        :value="inbox.pendingProposals"
        icon="💡"
        accent="#EC4899"
      />
    </div>

    <div class="recent-grid">
      <div class="surface recent">
        <h3>Últimos mensajes</h3>
        <ul>
          <li v-for="m in recentMessages" :key="m.id">
            <RouterLink :to="`/inbox/messages/${m.id}`">
              <strong>{{ m.sender_name }}</strong> — {{ m.subject }}
              <span class="time">{{ formatDateTime(m.sent_at) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="surface recent">
        <h3>Últimas solicitudes de participación</h3>
        <ul>
          <li v-for="p in recentParticipation" :key="p.id">
            <RouterLink :to="`/inbox/participation/${p.id}`">
              <strong>{{ p.full_name }}</strong>
              <span class="time">{{ formatDateTime(p.submitted_at) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="surface recent">
        <h3>Últimas propuestas</h3>
        <ul>
          <li v-for="p in recentProposals" :key="p.id">
            <RouterLink :to="`/inbox/proposals/${p.id}`">
              <strong>{{ p.problem_title }}</strong> — {{ p.submitter_name }}
              <span class="time">{{ formatDateTime(p.submitted_at) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
.recent {
  padding: 1.1rem;
}
.recent h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}
.recent ul {
  list-style: none;
}
.recent li {
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
}
.recent li:last-child {
  border-bottom: none;
}
.recent a:hover {
  color: var(--color-primary-light);
}
.time {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  margin-top: 0.15rem;
}
</style>
