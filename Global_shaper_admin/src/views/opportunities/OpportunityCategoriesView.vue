<script setup lang="ts">
import CategoryManager from '@/components/admin/CategoryManager.vue'
import { useOpportunitiesStore } from '@/stores/opportunities.store'
import type { OpportunityCategory } from '@/types'

const store = useOpportunitiesStore()
</script>

<template>
  <CategoryManager
    title="Categorías de Oportunidades"
    :items="store.categories"
    with-color
    with-order
    @create="(p) => store.createCategory(p as unknown as Omit<OpportunityCategory, 'id' | 'created_at' | 'updated_at'>)"
    @update="(id, p) => store.updateCategory(id, p)"
    @remove="(id) => store.removeCategory(id)"
  />
</template>
