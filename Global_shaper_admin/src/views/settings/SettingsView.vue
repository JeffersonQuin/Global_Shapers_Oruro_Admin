<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useSettingsStore } from '@/stores/settings.store'
import { useToast } from '@/composables/useToast'
import type { SiteSetting } from '@/types'

const store = useSettingsStore()
const toast = useToast()

type Kind = 'text' | 'es' | 'social' | 'json'

const SOCIAL_FIELDS = ['facebook', 'instagram', 'linkedin', 'twitter']
const TITLES: Record<string, string> = {
  general: 'General',
  home: 'Página de inicio',
  about: 'Acerca de',
  contact: 'Contacto y redes sociales',
}

// Borrador editable. Clave: id (o `${id}.${red}` para redes sociales).
const draft = reactive<Record<string, string>>({})
const savingCategory = ref('')

const categories = computed(() => {
  const order = Object.keys(TITLES)
  const rank = (c: string) => (order.includes(c) ? order.indexOf(c) : order.length)
  return [...new Set(store.items.map((s) => s.category ?? 'general'))].sort(
    (a, b) => rank(a) - rank(b),
  )
})

function asObject(v: SiteSetting['value']): Record<string, unknown> {
  return v && typeof v === 'object' ? v : {}
}

/** En la BD cada configuración guarda su valor con una forma distinta. */
function kindOf(s: SiteSetting): Kind {
  if (s.key === 'social_media') return 'social'
  if (s.value == null || typeof s.value === 'string') return 'text'
  if ('es' in asObject(s.value)) return 'es'
  return 'json'
}

function fillDraft() {
  for (const s of store.items) {
    const kind = kindOf(s)
    if (kind === 'social') {
      const obj = asObject(s.value)
      for (const f of SOCIAL_FIELDS) {
        const v = obj[f]
        draft[`${s.id}.${f}`] = typeof v === 'string' ? v : ''
      }
    } else if (kind === 'text') {
      draft[s.id] = typeof s.value === 'string' ? s.value : ''
    } else if (kind === 'es') {
      draft[s.id] = String(asObject(s.value).es ?? '')
    } else {
      draft[s.id] = JSON.stringify(s.value, null, 2)
    }
  }
}

function buildValue(s: SiteSetting): SiteSetting['value'] {
  switch (kindOf(s)) {
    case 'social': {
      const next = { ...asObject(s.value) }
      for (const f of SOCIAL_FIELDS) next[f] = draft[`${s.id}.${f}`] ?? ''
      return next
    }
    case 'text':
      return draft[s.id] ?? ''
    case 'es':
      return { ...asObject(s.value), es: draft[s.id] ?? '' }
    default:
      return JSON.parse(draft[s.id] ?? 'null')
  }
}

onMounted(fillDraft)

async function saveCategory(category: string) {
  savingCategory.value = category
  await toast.attempt(async () => {
    for (const s of store.byCategory(category)) {
      const value = buildValue(s)
      if (JSON.stringify(value) !== JSON.stringify(s.value)) {
        await store.updateValue(s.id, value)
      }
    }
  }, 'Cambios guardados')
  savingCategory.value = ''
}

function isLong(s: SiteSetting) {
  return (draft[s.id]?.length ?? 0) > 80
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Configuración del sitio</h1>
    </div>

    <div v-for="c in categories" :key="c" class="surface group">
      <h3>{{ TITLES[c] ?? c }}</h3>

      <template v-for="s in store.byCategory(c)" :key="s.id">
        <template v-if="kindOf(s) === 'social'">
          <div v-for="f in SOCIAL_FIELDS" :key="f" class="field">
            <label>{{ s.description ?? s.key }} — {{ f }}</label>
            <input v-model="draft[`${s.id}.${f}`]" type="text" />
          </div>
        </template>

        <div v-else-if="kindOf(s) === 'json'" class="field">
          <label>{{ s.description ?? s.key }} (JSON)</label>
          <textarea v-model="draft[s.id]" rows="4"></textarea>
        </div>

        <div v-else class="field">
          <label>{{ s.description ?? s.key }}</label>
          <textarea v-if="isLong(s)" v-model="draft[s.id]" rows="3"></textarea>
          <input v-else v-model="draft[s.id]" type="text" />
        </div>
      </template>

      <div style="display: flex; justify-content: flex-end">
        <AppButton :disabled="savingCategory === c" @click="saveCategory(c)">
          Guardar cambios
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group {
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
  max-width: 720px;
}
.group h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}
</style>
