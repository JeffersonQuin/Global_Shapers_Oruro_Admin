<script setup lang="ts">
import CategoryManager from '@/components/admin/CategoryManager.vue'
import { useEventsStore } from '@/stores/events.store'
import type { EventCategory } from '@/types'

const store = useEventsStore()
</script>

<template>
  <CategoryManager
    title="Categorías de Eventos"
    :items="store.categories"
    with-color
    @create="(p) => store.createCategory(p as unknown as Omit<EventCategory, 'id' | 'created_at' | 'updated_at'>)"
    @update="(id, p) => store.updateCategory(id, p)"
    @remove="(id) => store.removeCategory(id)"
  />
</template>
