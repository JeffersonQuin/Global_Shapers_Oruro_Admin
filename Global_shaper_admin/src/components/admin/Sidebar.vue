<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useInboxStore } from '@/stores/inbox.store'

defineEmits<{ navigate: [] }>()

const router = useRouter()
const auth = useAuthStore()
const inbox = useInboxStore()

const isAdmin = computed(() => auth.user?.role === 'admin')

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">GS</div>
      <div class="brand-text">
        <strong>Global Shapers</strong>
        <span>Hub Oruro</span>
      </div>
    </div>

    <nav class="nav">
      <RouterLink to="/dashboard" class="nav-link" @click="$emit('navigate')">
        <span class="ico">▣</span> Dashboard
      </RouterLink>

      <div class="nav-group">Contenido</div>
      <RouterLink to="/initiatives" class="nav-link" @click="$emit('navigate')">
        <span class="ico">◆</span> Iniciativas
      </RouterLink>
      <RouterLink to="/events" class="nav-link" @click="$emit('navigate')">
        <span class="ico">◇</span> Eventos
      </RouterLink>
      <RouterLink to="/opportunities" class="nav-link" @click="$emit('navigate')">
        <span class="ico">★</span> Oportunidades
      </RouterLink>

      <div class="nav-group">Bandeja de entrada</div>
      <RouterLink to="/inbox/messages" class="nav-link" @click="$emit('navigate')">
        <span class="ico">✉</span> Mensajes
        <span v-if="inbox.unreadMessages" class="count">{{ inbox.unreadMessages }}</span>
      </RouterLink>
      <RouterLink to="/inbox/participation" class="nav-link" @click="$emit('navigate')">
        <span class="ico">◉</span> Participación
        <span v-if="inbox.pendingParticipation" class="count">{{ inbox.pendingParticipation }}</span>
      </RouterLink>
      <RouterLink to="/inbox/proposals" class="nav-link" @click="$emit('navigate')">
        <span class="ico">💡</span> Propuestas
        <span v-if="inbox.pendingProposals" class="count">{{ inbox.pendingProposals }}</span>
      </RouterLink>

      <div class="nav-group">Sistema</div>
      <RouterLink to="/chatbot" class="nav-link" @click="$emit('navigate')">
        <span class="ico">🤖</span> Chatbot
      </RouterLink>
      <RouterLink v-if="isAdmin" to="/settings" class="nav-link" @click="$emit('navigate')">
        <span class="ico">⚙</span> Configuración
      </RouterLink>
    </nav>

    <div class="sidebar-foot">
      <div class="user">
        <div class="avatar">{{ auth.user?.displayName?.charAt(0) }}</div>
        <div class="user-info">
          <strong>{{ auth.user?.displayName }}</strong>
          <span>{{ auth.user?.role }}</span>
        </div>
      </div>
      <button class="logout" @click="logout">Cerrar sesión</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-primary);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--color-accent);
  color: var(--color-primary-dark);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-text strong {
  font-size: 0.95rem;
  color: #fff;
}
.brand-text span {
  font-size: 0.78rem;
  color: var(--color-accent-light);
}
.nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 0.6rem;
}
.nav-group {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
  padding: 0.9rem 0.65rem 0.35rem;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.65rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-bottom: 2px;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.nav-link.router-link-active {
  background: var(--color-accent);
  color: var(--color-primary-dark);
  font-weight: 700;
}
.ico {
  width: 18px;
  text-align: center;
}
.count {
  margin-left: auto;
  background: var(--color-danger);
  color: #fff;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.05rem 0.45rem;
}
.sidebar-foot {
  padding: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.7rem;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-primary-dark);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.user-info strong {
  color: #fff;
  font-size: 0.85rem;
}
.user-info span {
  font-size: 0.72rem;
  color: var(--color-accent-light);
  text-transform: capitalize;
}
.logout {
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
}
.logout:hover {
  background: var(--color-danger);
}
</style>
