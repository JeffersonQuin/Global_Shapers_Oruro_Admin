<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/components/admin/Sidebar.vue'
import Topbar from '@/components/admin/Topbar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useInitiativesStore } from '@/stores/initiatives.store'
import { useEventsStore } from '@/stores/events.store'
import { useOpportunitiesStore } from '@/stores/opportunities.store'
import { useInboxStore } from '@/stores/inbox.store'
import { useChatbotStore } from '@/stores/chatbot.store'
import { useSettingsStore } from '@/stores/settings.store'
import { isSupabaseConfigured } from '@/lib/supabase'
import { errorMessage } from '@/composables/useToast'

const sidebarOpen = ref(false)

const ready = ref(false)
const loadError = ref('')

const stores = [
  useInitiativesStore(),
  useEventsStore(),
  useOpportunitiesStore(),
  useInboxStore(),
  useChatbotStore(),
  useSettingsStore(),
]

async function loadAll() {
  loadError.value = ''
  if (!isSupabaseConfigured) {
    loadError.value =
      'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env. Complétalos y reinicia npm run dev.'
    return
  }
  try {
    await Promise.all(stores.map((s) => s.load()))
    ready.value = true
  } catch (e) {
    loadError.value = errorMessage(e)
  }
}

onMounted(loadAll)
</script>

<template>
  <div class="layout" :class="{ 'sidebar-open': sidebarOpen }">
    <div class="backdrop" @click="sidebarOpen = false"></div>
    <Sidebar @navigate="sidebarOpen = false" />
    <div class="main">
      <Topbar @toggle="sidebarOpen = !sidebarOpen" />
      <div class="content">
        <RouterView v-if="ready" />
        <div v-else-if="loadError" class="state-box surface">
          <h3>No se pudieron cargar los datos</h3>
          <p>{{ loadError }}</p>
          <AppButton @click="loadAll">Reintentar</AppButton>
        </div>
        <div v-else class="state-box">Cargando datos…</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}
.main {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
}
.content {
  min-height: calc(100vh - var(--topbar-height));
}
.state-box {
  max-width: 520px;
  margin: 3rem auto;
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
}
.state-box h3 {
  color: var(--color-danger);
  margin-bottom: 0.5rem;
}
.state-box p {
  margin-bottom: 1rem;
  word-break: break-word;
}
.backdrop {
  display: none;
}
@media (max-width: 900px) {
  .main {
    margin-left: 0;
  }
  :deep(.sidebar) {
    transform: translateX(-100%);
    transition: transform 0.2s;
    z-index: 1200;
  }
  .sidebar-open :deep(.sidebar) {
    transform: translateX(0);
  }
  .sidebar-open .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1100;
  }
}
</style>
