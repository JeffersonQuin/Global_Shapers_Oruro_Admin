<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

defineEmits<{ toggle: [] }>()

const route = useRoute()
const auth = useAuthStore()

const TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  initiatives: 'Iniciativas',
  events: 'Eventos',
  opportunities: 'Oportunidades',
  inbox: 'Bandeja de entrada',
  chatbot: 'Chatbot',
  settings: 'Configuración',
}

const title = computed(() => {
  const seg = route.path.split('/').filter(Boolean)[0] ?? 'dashboard'
  return TITLES[seg] ?? 'Panel'
})
</script>

<template>
  <header class="topbar">
    <button class="hamburger" @click="$emit('toggle')">☰</button>
    <h2 class="title">{{ title }}</h2>
    <div class="user-chip">
      <span>{{ auth.user?.displayName }}</span>
      <span class="role">{{ auth.user?.role }}</span>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}
.title {
  flex: 1;
  font-size: 1.15rem;
  color: var(--color-primary);
}
.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: var(--color-primary);
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}
.role {
  background: var(--color-accent);
  color: var(--color-primary-dark);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
}
@media (max-width: 900px) {
  .hamburger {
    display: block;
  }
}
</style>
