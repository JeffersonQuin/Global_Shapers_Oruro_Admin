import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EventItem, EventCategory, UUID } from '@/types'
import { table, upsertLocal } from '@/lib/db'

const itemsApi = table<EventItem>('events', { column: 'start_datetime', ascending: false })
const categoriesApi = table<EventCategory>('event_categories', { column: 'name' })

export const useEventsStore = defineStore('events', () => {
  const items = ref<EventItem[]>([])
  const categories = ref<EventCategory[]>([])

  const total = computed(() => items.value.length)
  const upcomingCount = computed(
    () => items.value.filter((e) => new Date(e.start_datetime) >= new Date()).length,
  )
  const pastCount = computed(
    () => items.value.filter((e) => new Date(e.start_datetime) < new Date()).length,
  )

  async function load() {
    const [i, c] = await Promise.all([itemsApi.list(), categoriesApi.list()])
    items.value = i
    categories.value = c
  }

  function getById(id: UUID) {
    return items.value.find((e) => e.id === id) ?? null
  }

  async function create(payload: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>) {
    upsertLocal(items.value, await itemsApi.insert(payload))
  }

  async function update(id: UUID, payload: Partial<EventItem>) {
    upsertLocal(items.value, await itemsApi.update(id, payload))
  }

  async function remove(id: UUID) {
    await itemsApi.remove(id)
    items.value = items.value.filter((e) => e.id !== id)
  }

  function categoryName(id: UUID | null) {
    return categories.value.find((c) => c.id === id)?.name ?? '—'
  }

  async function createCategory(payload: Omit<EventCategory, 'id' | 'created_at' | 'updated_at'>) {
    categories.value.push(await categoriesApi.insert(payload))
  }
  async function updateCategory(id: UUID, payload: Partial<EventCategory>) {
    upsertLocal(categories.value, await categoriesApi.update(id, payload))
  }
  async function removeCategory(id: UUID) {
    await categoriesApi.remove(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return {
    items, categories, total, upcomingCount, pastCount,
    load, getById, create, update, remove, categoryName,
    createCategory, updateCategory, removeCategory,
  }
})
