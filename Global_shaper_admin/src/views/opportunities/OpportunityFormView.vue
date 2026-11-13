<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import TagInput from '@/components/admin/TagInput.vue'
import { useOpportunitiesStore } from '@/stores/opportunities.store'
import { useToast } from '@/composables/useToast'
import { slugify } from '@/composables/useSlug'
import type { OpportunityType, OpportunityStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useOpportunitiesStore()
const toast = useToast()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)

function toLocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const form = reactive({
  title: '',
  slug: '',
  description: '',
  category_id: '',
  opportunity_type: 'call' as OpportunityType,
  requirements: '',
  application_process: '',
  application_link: '',
  application_deadline: '',
  time_commitment: '',
  benefits: '',
  status: 'draft' as OpportunityStatus,
  featured_image_url: '',
  is_featured: false,
  contact_name: '',
  contact_email: '',
})
const tags = ref<string[]>([])
const errors = reactive<Record<string, string>>({})
let slugTouched = false

const typeOptions = [
  { value: 'call', label: 'Convocatoria' },
  { value: 'volunteer', label: 'Voluntariado' },
  { value: 'workshop', label: 'Taller' },
  { value: 'scholarship', label: 'Beca' },
  { value: 'event', label: 'Evento' },
  { value: 'other', label: 'Otro' },
]
const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'open', label: 'Abierta' },
  { value: 'closed', label: 'Cerrada' },
]
const categoryOptions = computed(() => store.categories.map((c) => ({ value: c.id, label: c.name })))

const deadlinePassed = computed(() => {
  if (!form.application_deadline) return false
  return new Date(form.application_deadline) < new Date()
})

onMounted(() => {
  if (isEdit.value && id.value) {
    const o = store.getById(id.value)
    if (o) {
      Object.assign(form, {
        title: o.title,
        slug: o.slug,
        description: o.description,
        category_id: o.category_id ?? '',
        opportunity_type: o.opportunity_type,
        requirements: o.requirements ?? '',
        application_process: o.application_process ?? '',
        application_link: o.application_link ?? '',
        application_deadline: toLocal(o.application_deadline),
        time_commitment: o.time_commitment ?? '',
        benefits: o.benefits ?? '',
        status: o.status,
        featured_image_url: o.featured_image_url ?? '',
        is_featured: o.is_featured,
        contact_name: o.contact_info?.name ?? '',
        contact_email: o.contact_info?.email ?? '',
      })
      tags.value = [...o.tags]
      slugTouched = true
    }
  }
})

function onTitle(v: string) {
  form.title = v
  if (!slugTouched) form.slug = slugify(v)
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.title.trim()) errors.title = 'Requerido'
  if (!form.slug.trim()) errors.slug = 'Requerido'
  if (!form.description.trim()) errors.description = 'Requerido'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) {
    toast.error('Revisa los campos requeridos')
    return
  }
  const payload = {
    title: form.title,
    slug: form.slug,
    description: form.description,
    category_id: form.category_id || null,
    opportunity_type: form.opportunity_type,
    requirements: form.requirements || undefined,
    application_process: form.application_process || undefined,
    application_link: form.application_link || undefined,
    application_deadline: form.application_deadline ? new Date(form.application_deadline).toISOString() : undefined,
    time_commitment: form.time_commitment || undefined,
    benefits: form.benefits || undefined,
    status: form.status,
    featured_image_url: form.featured_image_url || undefined,
    is_featured: form.is_featured,
    tags: tags.value,
    contact_info:
      form.contact_name || form.contact_email
        ? { name: form.contact_name || undefined, email: form.contact_email || undefined }
        : undefined,
  }
  if (isEdit.value && id.value) {
    store.update(id.value, payload)
    toast.success('Oportunidad actualizada')
  } else {
    store.create(payload)
    toast.success('Oportunidad creada')
  }
  router.push('/opportunities')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar oportunidad' : 'Nueva oportunidad' }}</h1>
    </div>

    <form class="surface form-card" @submit.prevent="save">
      <AppInput label="Título" :model-value="form.title" required :error="errors.title" @update:model-value="onTitle" />
      <AppInput label="Slug" :model-value="form.slug" required :error="errors.slug" @update:model-value="(v) => { form.slug = v; slugTouched = true }" />
      <AppTextarea v-model="form.description" label="Descripción" required :rows="4" :error="errors.description" />

      <div class="grid-2">
        <AppSelect v-model="form.opportunity_type" label="Tipo" :options="typeOptions" />
        <AppSelect v-model="form.category_id" label="Categoría" :options="categoryOptions" placeholder="Sin categoría" />
      </div>

      <AppTextarea v-model="form.requirements" label="Requisitos" :rows="3" />
      <AppTextarea v-model="form.application_process" label="Proceso de aplicación" :rows="3" />

      <div class="grid-2">
        <AppInput v-model="form.application_link" label="Enlace de aplicación" type="url" />
        <div>
          <AppInput v-model="form.application_deadline" label="Fecha límite" type="datetime-local" />
          <p v-if="deadlinePassed" class="deadline-warn">⚠ Esta fecha límite ya venció</p>
        </div>
      </div>

      <div class="grid-2">
        <AppInput v-model="form.time_commitment" label="Tiempo de compromiso" />
        <AppSelect v-model="form.status" label="Estado" :options="statusOptions" />
      </div>

      <AppTextarea v-model="form.benefits" label="Beneficios" :rows="2" />
      <TagInput v-model="tags" label="Tags" />
      <AppInput v-model="form.featured_image_url" label="URL de imagen destacada" type="url" />

      <h3 style="margin: 0.5rem 0">Información de contacto</h3>
      <div class="grid-2">
        <AppInput v-model="form.contact_name" label="Nombre" />
        <AppInput v-model="form.contact_email" label="Email" type="email" />
      </div>

      <div class="checkbox-field">
        <input id="feat" v-model="form.is_featured" type="checkbox" />
        <label for="feat" style="margin: 0">Destacada</label>
      </div>

      <div class="form-actions">
        <AppButton variant="secondary" @click="router.push('/opportunities')">Cancelar</AppButton>
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
.deadline-warn {
  color: var(--color-warning);
  font-size: 0.78rem;
  margin-top: -0.5rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
