<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import TagInput from '@/components/admin/TagInput.vue'
import { useChatbotStore } from '@/stores/chatbot.store'
import { useToast } from '@/composables/useToast'
import type { ContentType } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useChatbotStore()
const toast = useToast()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)

const form = reactive({
  title: '',
  content: '',
  content_type: '' as ContentType | '',
  category: '',
  source_reference: '',
  priority: '0',
  is_active: true,
})
const tags = ref<string[]>([])
const errors = reactive<Record<string, string>>({})

const typeOptions = [
  { value: 'faq', label: 'FAQ' },
  { value: 'about', label: 'Acerca de' },
  { value: 'initiative', label: 'Iniciativa' },
  { value: 'event', label: 'Evento' },
  { value: 'opportunity', label: 'Oportunidad' },
  { value: 'general', label: 'General' },
]

onMounted(() => {
  if (isEdit.value && id.value) {
    const i = store.getById(id.value)
    if (i) {
      Object.assign(form, {
        title: i.title,
        content: i.content,
        content_type: i.content_type ?? '',
        category: i.category ?? '',
        source_reference: i.source_reference ?? '',
        priority: String(i.priority),
        is_active: i.is_active,
      })
      tags.value = [...i.tags]
    }
  }
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.title.trim()) errors.title = 'Requerido'
  if (!form.content.trim()) errors.content = 'Requerido'
  return Object.keys(errors).length === 0
}

function save() {
  if (!validate()) {
    toast.error('Revisa los campos requeridos')
    return
  }
  const payload = {
    title: form.title,
    content: form.content,
    content_type: form.content_type || undefined,
    category: form.category || undefined,
    source_reference: form.source_reference || undefined,
    priority: Number(form.priority) || 0,
    is_active: form.is_active,
    tags: tags.value,
  }
  if (isEdit.value && id.value) {
    store.update(id.value, payload)
    toast.success('Entrada actualizada')
  } else {
    store.create(payload)
    toast.success('Entrada creada')
  }
  router.push('/chatbot')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar entrada' : 'Nueva entrada' }}</h1>
    </div>

    <form class="surface form-card" @submit.prevent="save">
      <AppInput v-model="form.title" label="Título" required :error="errors.title" />
      <AppTextarea v-model="form.content" label="Contenido" required :rows="6" :error="errors.content" />

      <div class="grid-2">
        <AppSelect v-model="form.content_type" label="Tipo de contenido" :options="typeOptions" placeholder="Sin tipo" />
        <AppInput v-model="form.category" label="Categoría" />
      </div>

      <div class="grid-2">
        <AppInput v-model="form.source_reference" label="Referencia de fuente" />
        <AppInput v-model="form.priority" label="Prioridad" type="number" />
      </div>

      <TagInput v-model="tags" label="Tags" />

      <div class="checkbox-field">
        <input id="active" v-model="form.is_active" type="checkbox" />
        <label for="active" style="margin: 0">Activa</label>
      </div>

      <div class="form-actions">
        <AppButton variant="secondary" @click="router.push('/chatbot')">Cancelar</AppButton>
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
