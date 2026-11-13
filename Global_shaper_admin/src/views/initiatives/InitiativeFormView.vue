<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useInitiativesStore } from '@/stores/initiatives.store'
import { useToast } from '@/composables/useToast'
import { slugify } from '@/composables/useSlug'
import type { InitiativeStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useInitiativesStore()
const toast = useToast()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)

const form = reactive({
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  category_id: '' as string,
  status: 'planned' as InitiativeStatus,
  start_date: '',
  end_date: '',
  featured_image_url: '',
  is_featured: false,
  is_published: false,
})
const metrics = ref<{ key: string; value: string }[]>([])
const slugTouched = ref(false)
const errors = reactive<Record<string, string>>({})

const statusOptions = [
  { value: 'planned', label: 'Planificada' },
  { value: 'active', label: 'Activa' },
  { value: 'completed', label: 'Completada' },
  { value: 'paused', label: 'Pausada' },
]
const categoryOptions = computed(() => store.categories.map((c) => ({ value: c.id, label: c.name })))

onMounted(() => {
  if (isEdit.value && id.value) {
    const item = store.getById(id.value)
    if (item) {
      Object.assign(form, {
        title: item.title,
        slug: item.slug,
        short_description: item.short_description,
        full_description: item.full_description,
        category_id: item.category_id ?? '',
        status: item.status,
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        featured_image_url: item.featured_image_url ?? '',
        is_featured: item.is_featured,
        is_published: item.is_published,
      })
      metrics.value = Object.entries(item.impact_metrics).map(([k, v]) => ({ key: k, value: String(v) }))
      slugTouched.value = true
    }
  }
})

function onTitleInput(v: string) {
  form.title = v
  if (!slugTouched.value) form.slug = slugify(v)
}

function addMetric() {
  metrics.value.push({ key: '', value: '' })
}
function removeMetric(idx: number) {
  metrics.value.splice(idx, 1)
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.title.trim()) errors.title = 'El título es requerido'
  if (!form.slug.trim()) errors.slug = 'El slug es requerido'
  if (!form.short_description.trim()) errors.short_description = 'Requerido'
  if (!form.full_description.trim()) errors.full_description = 'Requerido'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) {
    toast.error('Revisa los campos requeridos')
    return
  }
  const impact_metrics: Record<string, string | number> = {}
  metrics.value.forEach((m) => {
    if (m.key.trim()) {
      const num = Number(m.value)
      impact_metrics[m.key.trim()] = m.value !== '' && !isNaN(num) ? num : m.value
    }
  })
  const payload = {
    title: form.title,
    slug: form.slug,
    short_description: form.short_description,
    full_description: form.full_description,
    category_id: form.category_id || null,
    status: form.status,
    start_date: form.start_date || undefined,
    end_date: form.end_date || undefined,
    featured_image_url: form.featured_image_url || undefined,
    gallery_images: [],
    impact_metrics,
    is_featured: form.is_featured,
    is_published: form.is_published,
  }
  if (isEdit.value && id.value) {
    store.update(id.value, payload)
    toast.success('Iniciativa actualizada')
  } else {
    store.create(payload)
    toast.success('Iniciativa creada')
  }
  router.push('/initiatives')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar iniciativa' : 'Nueva iniciativa' }}</h1>
    </div>

    <form class="surface form-card" @submit.prevent="save">
      <AppInput
        label="Título"
        :model-value="form.title"
        required
        :error="errors.title"
        @update:model-value="onTitleInput"
      />
      <AppInput
        label="Slug"
        :model-value="form.slug"
        required
        :error="errors.slug"
        @update:model-value="(v) => { form.slug = v; slugTouched = true }"
      />
      <AppTextarea
        v-model="form.short_description"
        label="Descripción corta"
        required
        :rows="2"
        :error="errors.short_description"
      />
      <AppTextarea
        v-model="form.full_description"
        label="Descripción completa"
        required
        :rows="5"
        :error="errors.full_description"
      />

      <div class="grid-2">
        <AppSelect
          v-model="form.category_id"
          label="Categoría"
          :options="categoryOptions"
          placeholder="Sin categoría"
        />
        <AppSelect v-model="form.status" label="Estado" :options="statusOptions" />
      </div>

      <div class="grid-2">
        <AppInput v-model="form.start_date" label="Fecha de inicio" type="date" />
        <AppInput v-model="form.end_date" label="Fecha de fin" type="date" />
      </div>

      <AppInput v-model="form.featured_image_url" label="URL de imagen destacada" type="url" />

      <div class="metrics">
        <label class="metrics-label">Métricas de impacto</label>
        <div v-for="(m, idx) in metrics" :key="idx" class="metric-row">
          <input v-model="m.key" placeholder="Clave (ej. beneficiarios)" />
          <input v-model="m.value" placeholder="Valor" />
          <button type="button" class="btn btn-ghost btn-sm" @click="removeMetric(idx)">✕</button>
        </div>
        <AppButton size="sm" variant="secondary" @click="addMetric">+ Agregar métrica</AppButton>
      </div>

      <div class="checkbox-field">
        <input id="feat" v-model="form.is_featured" type="checkbox" />
        <label for="feat" style="margin: 0">Destacada</label>
      </div>
      <div class="checkbox-field">
        <input id="pub" v-model="form.is_published" type="checkbox" />
        <label for="pub" style="margin: 0">Publicada</label>
      </div>

      <div class="form-actions">
        <AppButton variant="secondary" @click="router.push('/initiatives')">Cancelar</AppButton>
        <AppButton type="submit">Guardar</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card {
  padding: 1.5rem;
  max-width: 760px;
}
.metrics {
  margin-bottom: 1rem;
}
.metrics-label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.metric-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.metric-row input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: inherit;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
