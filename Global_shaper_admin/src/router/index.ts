import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', component: () => import('@/views/DashboardView.vue') },

        // Iniciativas
        { path: 'initiatives', component: () => import('@/views/initiatives/InitiativesListView.vue') },
        { path: 'initiatives/categories', component: () => import('@/views/initiatives/CategoriesView.vue') },
        { path: 'initiatives/new', component: () => import('@/views/initiatives/InitiativeFormView.vue') },
        { path: 'initiatives/:id/edit', component: () => import('@/views/initiatives/InitiativeFormView.vue') },

        // Eventos
        { path: 'events', component: () => import('@/views/events/EventsListView.vue') },
        { path: 'events/categories', component: () => import('@/views/events/EventCategoriesView.vue') },
        { path: 'events/new', component: () => import('@/views/events/EventFormView.vue') },
        { path: 'events/:id/edit', component: () => import('@/views/events/EventFormView.vue') },

        // Oportunidades
        { path: 'opportunities', component: () => import('@/views/opportunities/OpportunitiesListView.vue') },
        { path: 'opportunities/categories', component: () => import('@/views/opportunities/OpportunityCategoriesView.vue') },
        { path: 'opportunities/new', component: () => import('@/views/opportunities/OpportunityFormView.vue') },
        { path: 'opportunities/:id/edit', component: () => import('@/views/opportunities/OpportunityFormView.vue') },

        // Bandeja
        { path: 'inbox/messages', component: () => import('@/views/inbox/MessagesView.vue') },
        { path: 'inbox/messages/:id', component: () => import('@/views/inbox/MessageDetailView.vue') },
        { path: 'inbox/participation', component: () => import('@/views/inbox/ParticipationView.vue') },
        { path: 'inbox/participation/:id', component: () => import('@/views/inbox/ParticipationDetailView.vue') },
        { path: 'inbox/proposals', component: () => import('@/views/inbox/ProposalsView.vue') },
        { path: 'inbox/proposals/categories', component: () => import('@/views/inbox/ProposalCategoriesView.vue') },
        { path: 'inbox/proposals/:id', component: () => import('@/views/inbox/ProposalDetailView.vue') },

        // Chatbot
        { path: 'chatbot', component: () => import('@/views/chatbot/ChatbotKnowledgeView.vue') },
        { path: 'chatbot/new', component: () => import('@/views/chatbot/ChatbotEntryFormView.vue') },
        { path: 'chatbot/:id/edit', component: () => import('@/views/chatbot/ChatbotEntryFormView.vue') },

        // Configuración (solo admin)
        { path: 'settings', component: () => import('@/views/settings/SettingsView.vue'), meta: { role: 'admin' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { path: '/login' }
  }
  if (to.path === '/login' && auth.isAuthenticated) {
    return { path: '/dashboard' }
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return { path: '/dashboard' }
  }
  return true
})

export default router
