import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Opportunity, OpportunityCategory, UUID } from '@/types'
import { table, upsertLocal } from '@/lib/db'

const itemsApi = table<Opportunity>('opportunities', { column: 'created_at', ascending: false })
const categoriesApi = table<OpportunityCategory>('opportunity_categories', { column: 'display_order' })

export const useOpportunitiesStore = defineStore('opportunities', () => {
  const items = ref<Opportunity[]>([])
  const categories = ref<OpportunityCategory[]>([])

  const total = computed(() => items.value.length)
  const openCount = computed(() => items.value.filter((o) => o.status === 'open').length)
  const closedCount = computed(() => items.value.filter((o) => o.status === 'closed').length)

  async function load() {
    const [i, c] = await Promise.all([itemsApi.list(), categoriesApi.list()])
    items.value = i
    categories.value = c
  }

  function getById(id: UUID) {
    return items.value.find((o) => o.id === id) ?? null
  }

  async function create(payload: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) {
    upsertLocal(items.value, await itemsApi.insert(payload))
  }

  async function update(id: UUID, payload: Partial<Opportunity>) {
    upsertLocal(items.value, await itemsApi.update(id, payload))
  }

  async function remove(id: UUID) {
    await itemsApi.remove(id)
    items.value = items.value.filter((o) => o.id !== id)
  }

  function categoryName(id: UUID | null) {
    return categories.value.find((c) => c.id === id)?.name ?? '—'
  }

  async function createCategory(
    payload: Omit<OpportunityCategory, 'id' | 'created_at' | 'updated_at'>,
  ) {
    categories.value.push(await categoriesApi.insert(payload))
  }
  async function updateCategory(id: UUID, payload: Partial<OpportunityCategory>) {
    upsertLocal(categories.value, await categoriesApi.update(id, payload))
  }
  async function removeCategory(id: UUID) {
    await categoriesApi.remove(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return {
    items, categories, total, openCount, closedCount,
    load, getById, create, update, remove, categoryName,
    createCategory, updateCategory, removeCategory,
  }
})
