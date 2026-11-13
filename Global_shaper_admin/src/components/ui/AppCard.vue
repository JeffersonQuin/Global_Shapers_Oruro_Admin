<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  icon?: string
  sub?: string
  accent?: string
}>()
</script>

<template>
  <div class="stat-card surface">
    <div class="stat-icon" :style="{ background: accent || 'var(--color-primary)' }">
      {{ icon || '•' }}
    </div>
    <div class="stat-body">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
      <div v-if="sub" class="stat-sub">{{ sub }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem;
}
.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1;
}
.stat-label {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-top: 0.2rem;
}
.stat-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.15rem;
}
</style>
