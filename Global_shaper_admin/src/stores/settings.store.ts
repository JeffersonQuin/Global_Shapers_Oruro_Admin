import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SiteSetting, UUID } from '@/types'
import { table, upsertLocal } from '@/lib/db'

const api = table<SiteSetting>('site_settings', { column: 'key' })

export const useSettingsStore = defineStore('settings', () => {
  const items = ref<SiteSetting[]>([])

  async function load() {
    items.value = await api.list()
  }

  function byCategory(category: string) {
    return items.value.filter((s) => (s.category ?? 'general') === category)
  }

  /** Guarda el valor JSONB completo de una configuración. */
  async function updateValue(id: UUID, value: SiteSetting['value']) {
    upsertLocal(items.value, await api.update(id, { value }))
  }

  return { items, load, byCategory, updateValue }
})
