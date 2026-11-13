<script setup lang="ts">
import CategoryManager from '@/components/admin/CategoryManager.vue'
import { useInitiativesStore } from '@/stores/initiatives.store'
import type { InitiativeCategory } from '@/types'

const store = useInitiativesStore()
</script>

<template>
  <CategoryManager
    title="Categorías de Iniciativas"
    :items="store.categories"
    with-color
    with-order
    @create="(p) => store.createCategory(p as unknown as Omit<InitiativeCategory, 'id' | 'created_at' | 'updated_at'>)"
    @update="(id, p) => store.updateCategory(id, p)"
    @remove="(id) => store.removeCategory(id)"
  />
</template>
