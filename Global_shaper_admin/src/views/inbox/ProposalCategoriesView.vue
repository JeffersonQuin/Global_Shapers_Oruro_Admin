<script setup lang="ts">
import CategoryManager from '@/components/admin/CategoryManager.vue'
import { useInboxStore } from '@/stores/inbox.store'
import type { ProposalCategory } from '@/types'

const store = useInboxStore()
</script>

<template>
  <CategoryManager
    title="Categorías de Propuestas"
    :items="store.proposalCategories"
    @create="(p) => store.createProposalCategory(p as unknown as Omit<ProposalCategory, 'id' | 'created_at'>)"
    @update="(id, p) => store.updateProposalCategory(id, p)"
    @remove="(id) => store.removeProposalCategory(id)"
  />
</template>
