<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>()
defineEmits<{ 'update:page': [value: number] }>()
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button :disabled="page <= 1" @click="$emit('update:page', page - 1)">‹</button>
    <button
      v-for="p in totalPages"
      :key="p"
      :class="{ active: p === page }"
      @click="$emit('update:page', p)"
    >
      {{ p }}
    </button>
    <button :disabled="page >= totalPages" @click="$emit('update:page', page + 1)">›</button>
  </div>
</template>
