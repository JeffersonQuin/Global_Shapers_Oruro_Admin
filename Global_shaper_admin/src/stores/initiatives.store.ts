import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Initiative, InitiativeCategory, UUID } from '@/types'
import { table, upsertLocal } from '@/lib/db'

const itemsApi = table<Initiative>('initiatives', { column: 'created_at', ascending: false })
const categoriesApi = table<InitiativeCategory>('initiative_categories', { column: 'display_order' })

export type NewInitiative = Omit<
  Initiative,
  'id' | 'created_at' | 'updated_at' | 'view_count' | 'gallery_images'
>

export const useInitiativesStore = defineStore('initiatives', () => {
  const items = ref<Initiative[]>([])
  const categories = ref<InitiativeCategory[]>([])

  const total = computed(() => items.value.length)
  const publishedCount = computed(() => items.value.filter((i) => i.is_published).length)
  const draftCount = computed(() => items.value.filter((i) => !i.is_published).length)

  async function load() {
    const [i, c] = await Promise.all([itemsApi.list(), categoriesApi.list()])
    items.value = i
    categories.value = c
  }

  function getById(id: UUID) {
    return items.value.find((i) => i.id === id) ?? null
  }

  // El panel no edita la galería. Se excluye siempre para que guardar una
  // iniciativa no borre las imágenes que ya existen en la base de datos.
  function withoutGallery<T extends Partial<Initiative>>(payload: T): T {
    const body = { ...payload }
    delete body.gallery_images
    return body
  }

  async function create(payload: NewInitiative) {
    upsertLocal(items.value, await itemsApi.insert(withoutGallery(payload)))
  }

  async function update(id: UUID, payload: Partial<Initiative>) {
    upsertLocal(items.value, await itemsApi.update(id, withoutGallery(payload)))
  }

  async function remove(id: UUID) {
    await itemsApi.remove(id)
    items.value = items.value.filter((i) => i.id !== id)
  }

  function categoryName(id: UUID | null) {
    return categories.value.find((c) => c.id === id)?.name ?? '—'
  }

  async function createCategory(
    payload: Omit<InitiativeCategory, 'id' | 'created_at' | 'updated_at'>,
  ) {
    const row = await categoriesApi.insert(payload)
    categories.value.push(row)
  }
  async function updateCategory(id: UUID, payload: Partial<InitiativeCategory>) {
    upsertLocal(categories.value, await categoriesApi.update(id, payload))
  }
  async function removeCategory(id: UUID) {
    await categoriesApi.remove(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  return {
    items, categories, total, publishedCount, draftCount,
    load, getById, create, update, remove, categoryName,
    createCategory, updateCategory, removeCategory,
  }
})
