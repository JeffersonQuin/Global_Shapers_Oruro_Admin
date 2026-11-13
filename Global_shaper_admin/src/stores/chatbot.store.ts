import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatbotKnowledge, UUID } from '@/types'
import { table, upsertLocal } from '@/lib/db'

const api = table<ChatbotKnowledge>('chatbot_knowledge', { column: 'priority', ascending: false })

export const useChatbotStore = defineStore('chatbot', () => {
  const items = ref<ChatbotKnowledge[]>([])

  const total = computed(() => items.value.length)

  async function load() {
    items.value = await api.list()
  }

  function getById(id: UUID) {
    return items.value.find((i) => i.id === id) ?? null
  }

  async function create(payload: Omit<ChatbotKnowledge, 'id' | 'created_at' | 'updated_at'>) {
    upsertLocal(items.value, await api.insert(payload))
  }

  async function update(id: UUID, payload: Partial<ChatbotKnowledge>) {
    upsertLocal(items.value, await api.update(id, payload))
  }

  async function remove(id: UUID) {
    await api.remove(id)
    items.value = items.value.filter((i) => i.id !== id)
  }

  return { items, total, load, getById, create, update, remove }
})
