<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useToast } from '@/composables/useToast'
import { slugify } from '@/composables/useSlug'

interface GenericCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  display_order?: number
  is_active: boolean
}

const props = defineProps<{
  title: string
  items: GenericCategory[]
  withColor?: boolean
  withOrder?: boolean
}>()

const emit = defineEmits<{
  create: [payload: Record<string, unknown>]
  update: [id: string, payload: Record<string, unknown>]
  remove: [id: string]
}>()

const toast = useToast()
const editingId = ref<string | null>(null)
const showForm = ref(false)
const toDelete = ref<string | null>(null)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  color: '#3B82F6',
  display_order: 0,
  is_active: true,
})

function resetForm() {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.color = '#3B82F6'
  form.display_order = 0
  form.is_active = true
}

function openNew() {
  resetForm()
  editingId.value = null
  showForm.value = true
}

function openEdit(c: GenericCategory) {
  form.name = c.name
  form.slug = c.slug
  form.description = c.description ?? ''
  form.color = c.color ?? '#3B82F6'
  form.display_order = c.display_order ?? 0
  form.is_active = c.is_active
  editingId.value = c.id
  showForm.value = true
}

function save() {
  if (!form.name.trim()) {
    toast.error('El nombre es requerido')
    return
  }
  const slug = form.slug.trim() || slugify(form.name)
  const payload: Record<string, unknown> = {
    name: form.name,
    slug,
    description: form.description || undefined,
    is_active: form.is_active,
  }
  if (props.withColor) payload.color = form.color
  if (props.withOrder) payload.display_order = Number(form.display_order) || 0

  if (editingId.value) {
    emit('update', editingId.value, payload)
    toast.success('Categoría actualizada')
  } else {
    emit('create', payload)
    toast.success('Categoría creada')
  }
  showForm.value = false
}

function confirmDelete() {
  if (toDelete.value) {
    emit('remove', toDelete.value)
    toast.success('Categoría eliminada')
    toDelete.value = null
  }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ title }}</h1>
      <AppButton @click="openNew">+ Nueva categoría</AppButton>
    </div>

    <div class="surface table-wrap">
      <table class="data">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Slug</th>
            <th v-if="withColor">Color</th>
            <th v-if="withOrder">Orden</th>
            <th>Activa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in items" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.slug }}</td>
            <td v-if="withColor">
              <span class="swatch" :style="{ background: c.color }"></span> {{ c.color }}
            </td>
            <td v-if="withOrder">{{ c.display_order }}</td>
            <td>{{ c.is_active ? 'Sí' : 'No' }}</td>
            <td>
              <div class="actions-cell">
                <AppButton size="sm" variant="secondary" @click="openEdit(c)">Editar</AppButton>
                <AppButton size="sm" variant="danger" @click="toDelete = c.id">Eliminar</AppButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!items.length" class="empty-state">No hay categorías todavía.</div>
    </div>

    <!-- Formulario modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal" style="max-width: 460px">
        <h3>{{ editingId ? 'Editar categoría' : 'Nueva categoría' }}</h3>
        <div class="field">
          <label>Nombre <span class="req">*</span></label>
          <input v-model="form.name" @input="!editingId && (form.slug = slugify(form.name))" />
        </div>
        <div class="field">
          <label>Slug</label>
          <input v-model="form.slug" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <textarea v-model="form.description" rows="2"></textarea>
        </div>
        <div v-if="withColor" class="field">
          <label>Color</label>
          <input v-model="form.color" type="color" style="height: 40px; padding: 2px" />
        </div>
        <div v-if="withOrder" class="field">
          <label>Orden</label>
          <input v-model="form.display_order" type="number" />
        </div>
        <div class="checkbox-field">
          <input id="cat-active" v-model="form.is_active" type="checkbox" />
          <label for="cat-active" style="margin: 0">Activa</label>
        </div>
        <div class="modal-actions">
          <AppButton variant="secondary" @click="showForm = false">Cancelar</AppButton>
          <AppButton @click="save">Guardar</AppButton>
        </div>
      </div>
    </div>

    <AppModal
      :show="!!toDelete"
      title="Eliminar categoría"
      message="¿Seguro que deseas eliminar esta categoría?"
      confirm-text="Eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>

<style scoped>
.swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  vertical-align: middle;
  margin-right: 4px;
}
</style>
