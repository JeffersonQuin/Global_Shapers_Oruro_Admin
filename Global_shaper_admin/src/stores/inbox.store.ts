import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ContactMessage,
  ParticipationRequest,
  CommunityProposal,
  ProposalCategory,
  UUID,
} from '@/types'
import { table, upsertLocal } from '@/lib/db'

const messagesApi = table<ContactMessage>('contact_messages', { column: 'sent_at', ascending: false })
const participationApi = table<ParticipationRequest>('participation_requests', {
  column: 'submitted_at',
  ascending: false,
})
const proposalsApi = table<CommunityProposal>('community_proposals', {
  column: 'submitted_at',
  ascending: false,
})
const proposalCategoriesApi = table<ProposalCategory>('proposal_categories', { column: 'name' })

export const useInboxStore = defineStore('inbox', () => {
  const messages = ref<ContactMessage[]>([])
  const participation = ref<ParticipationRequest[]>([])
  const proposals = ref<CommunityProposal[]>([])
  const proposalCategories = ref<ProposalCategory[]>([])

  // Contadores para badges
  const unreadMessages = computed(() => messages.value.filter((m) => m.status === 'unread').length)
  const pendingParticipation = computed(
    () => participation.value.filter((p) => p.status === 'pending').length,
  )
  const pendingProposals = computed(
    () => proposals.value.filter((p) => p.status === 'submitted').length,
  )
  const totalPending = computed(
    () => unreadMessages.value + pendingParticipation.value + pendingProposals.value,
  )

  async function load() {
    const [m, p, pr, pc] = await Promise.all([
      messagesApi.list(),
      participationApi.list(),
      proposalsApi.list(),
      proposalCategoriesApi.list(),
    ])
    messages.value = m
    participation.value = p
    proposals.value = pr
    proposalCategories.value = pc
  }

  // Mensajes
  function getMessage(id: UUID) {
    return messages.value.find((m) => m.id === id) ?? null
  }
  async function updateMessage(id: UUID, payload: Partial<ContactMessage>) {
    upsertLocal(messages.value, await messagesApi.update(id, payload))
  }
  async function markRead(id: UUID) {
    const m = getMessage(id)
    if (!m || m.status !== 'unread') return
    await updateMessage(id, { status: 'read', read_at: new Date().toISOString() })
  }

  // Participación
  function getParticipation(id: UUID) {
    return participation.value.find((p) => p.id === id) ?? null
  }
  async function updateParticipation(id: UUID, payload: Partial<ParticipationRequest>) {
    const row = await participationApi.update(id, {
      ...payload,
      reviewed_at: new Date().toISOString(),
    })
    upsertLocal(participation.value, row)
  }

  // Propuestas
  function getProposal(id: UUID) {
    return proposals.value.find((p) => p.id === id) ?? null
  }
  async function updateProposal(id: UUID, payload: Partial<CommunityProposal>) {
    const row = await proposalsApi.update(id, {
      ...payload,
      reviewed_at: new Date().toISOString(),
    })
    upsertLocal(proposals.value, row)
  }
  function proposalCategoryName(id: UUID | null) {
    return proposalCategories.value.find((c) => c.id === id)?.name ?? '—'
  }

  // Categorías de propuestas
  async function createProposalCategory(payload: Omit<ProposalCategory, 'id' | 'created_at'>) {
    proposalCategories.value.push(await proposalCategoriesApi.insert(payload))
  }
  async function updateProposalCategory(id: UUID, payload: Partial<ProposalCategory>) {
    upsertLocal(proposalCategories.value, await proposalCategoriesApi.update(id, payload))
  }
  async function removeProposalCategory(id: UUID) {
    await proposalCategoriesApi.remove(id)
    proposalCategories.value = proposalCategories.value.filter((c) => c.id !== id)
  }

  return {
    messages, participation, proposals, proposalCategories,
    unreadMessages, pendingParticipation, pendingProposals, totalPending,
    load, getMessage, markRead, updateMessage,
    getParticipation, updateParticipation,
    getProposal, updateProposal, proposalCategoryName,
    createProposalCategory, updateProposalCategory, removeProposalCategory,
  }
})
