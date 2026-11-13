<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useEventsStore } from '@/stores/events.store'
import { useToast } from '@/composables/useToast'
import { slugify } from '@/composables/useSlug'
import type { EventLocationType, EventStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useEventsStore()
const toast = useToast()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)

/** Convierte ISO a formato datetime-local (YYYY-MM-DDTHH:mm) */
function toLocal(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function toISO(local: string): string {
  return local ? new Date(local).toISOString() : ''
}

const form = reactive({
  title: '',
  slug: '',
  description: '',
  category_id: '',
  start_datetime: '',
  end_datetime: '',
  location_type: 'physical' as EventLocationType,
  location_address: '',
  virtual_link: '',
  registration_link: '',
  registration_deadline: '',
  capacity: '' as string,
  status: 'draft' as EventStatus,
  featured_image_url: '',
  is_featured: false,
  contact_name: '',
  contact_email: '',
  contact_phone: '',
})
const errors = reactive<Record<string, string>>({})
let slugTouched = false

const statusOptions = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'completed', label: 'Completado' },
]
const locationOptions = [
  { value: 'physical', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hybrid', label: 'Híbrido' },
]
const categoryOptions = computed(() => store.categories.map((c) => ({ value: c.id, label: c.name })))

const showAddress = computed(() => form.location_type !== 'virtual')
const showVirtual = computed(() => form.location_type !== 'physical')

onMounted(() => {
  if (isEdit.value && id.value) {
    const e = store.getById(id.value)
    if (e) {
      Object.assign(form, {
        title: e.title,
        slug: e.slug,
        description: e.description,
        category_id: e.category_id ?? '',
        start_datetime: toLocal(e.start_datetime),
        end_datetime: toLocal(e.end_datetime),
        location_type: e.location_type,
        location_address: e.location_address ?? '',
        virtual_link: e.virtual_link ?? '',
        registration_link: e.registration_link ?? '',
        registration_deadline: toLocal(e.registration_deadline),
        capacity: e.capacity != null ? String(e.capacity) : '',
        status: e.status,
        featured_image_url: e.featured_image_url ?? '',
        is_featured: e.is_featured,
        contact_name: e.contact_info?.name ?? '',
        contact_email: e.contact_info?.email ?? '',
        contact_phone: e.contact_info?.phone ?? '',
      })
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
  if (!form.start_datetime) errors.start_datetime = 'Requerido'
  if (!form.end_datetime) errors.end_datetime = 'Requerido'
  if (form.start_datetime && form.end_datetime && form.end_datetime <= form.start_datetime) {
    errors.end_datetime = 'Debe ser posterior al inicio'
  }
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
    start_datetime: toISO(form.start_datetime),
    end_datetime: toISO(form.end_datetime),
    location_type: form.location_type,
    location_address: form.location_address || undefined,
    virtual_link: form.virtual_link || undefined,
    registration_link: form.registration_link || undefined,
    registration_deadline: form.registration_deadline ? toISO(form.registration_deadline) : undefined,
    capacity: form.capacity ? Number(form.capacity) : undefined,
    status: form.status,
    featured_image_url: form.featured_image_url || undefined,
    is_featured: form.is_featured,
    contact_info:
      form.contact_name || form.contact_email || form.contact_phone
        ? { name: form.contact_name || undefined, email: form.contact_email || undefined, phone: form.contact_phone || undefined }
        : undefined,
  }
  if (isEdit.value && id.value) {
    store.update(id.value, payload)
    toast.success('Evento actualizado')
  } else {
    store.create(payload)
    toast.success('Evento creado')
  }
  router.push('/events')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar evento' : 'Nuevo evento' }}</h1>
    </div>

    <form class="surface form-card" @submit.prevent="save">
      <AppInput label="Título" :model-value="form.title" required :error="errors.title" @update:model-value="onTitle" />
      <AppInput label="Slug" :model-value="form.slug" required :error="errors.slug" @update:model-value="(v) => { form.slug = v; slugTouched = true }" />
      <AppTextarea v-model="form.description" label="Descripción" required :rows="4" :error="errors.description" />

      <div class="grid-2">
        <AppSelect v-model="form.category_id" label="Categoría" :options="categoryOptions" placeholder="Sin categoría" />
        <AppSelect v-model="form.status" label="Estado" :options="statusOptions" />
      </div>

      <div class="grid-2">
        <AppInput v-model="form.start_datetime" label="Inicio" type="datetime-local" required :error="errors.start_datetime" />
        <AppInput v-model="form.end_datetime" label="Fin" type="datetime-local" required :error="errors.end_datetime" />
      </div>

      <AppSelect v-model="form.location_type" label="Tipo de lugar" :options="locationOptions" />
      <AppInput v-if="showAddress" v-model="form.location_address" label="Dirección" />
      <AppInput v-if="showVirtual" v-model="form.virtual_link" label="Enlace virtual" type="url" />

      <div class="grid-2">
        <AppInput v-model="form.registration_link" label="Enlace de registro" type="url" />
        <AppInput v-model="form.registration_deadline" label="Límite de registro" type="datetime-local" />
      </div>

      <div class="grid-2">
        <AppInput v-model="form.capacity" label="Capacidad" type="number" />
        <AppInput v-model="form.featured_image_url" label="URL de imagen destacada" type="url" />
      </div>

      <h3 style="margin: 0.5rem 0">Información de contacto</h3>
      <div class="grid-2">
        <AppInput v-model="form.contact_name" label="Nombre" />
        <AppInput v-model="form.contact_email" label="Email" type="email" />
      </div>
      <AppInput v-model="form.contact_phone" label="Teléfono" />

      <div class="checkbox-field">
        <input id="feat" v-model="form.is_featured" type="checkbox" />
        <label for="feat" style="margin: 0">Destacado</label>
      </div>

      <div class="form-actions">
        <AppButton variant="secondary" @click="router.push('/events')">Cancelar</AppButton>
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
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
