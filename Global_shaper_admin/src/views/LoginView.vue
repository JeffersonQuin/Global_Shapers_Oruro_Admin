<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!username.value.trim() || !password.value) {
    error.value = 'Ingresa usuario y contraseña.'
    return
  }
  loading.value = true
  const ok = await auth.login(username.value, password.value)
  loading.value = false
  if (ok) {
    router.push('/dashboard')
  } else {
    error.value = 'Usuario o contraseña incorrectos.'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">GS</div>
      <h1>Global Shapers</h1>
      <p class="sub">Panel Administrativo — Hub Oruro</p>

      <form @submit.prevent="submit">
        <div class="field">
          <label>Usuario</label>
          <input v-model="username" type="text" placeholder="admin" autocomplete="username" />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <div class="pw-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <button type="button" class="pw-toggle" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="login-error">{{ error }}</div>

        <button class="btn btn-primary btn-lg submit" type="submit" :disabled="loading">
          {{ loading ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>

      <div class="hint">
        <strong>Credenciales de prueba:</strong><br />
        admin / shapers2024 &nbsp;·&nbsp; editor / oruro2024
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  padding: 1rem;
}
.login-card {
  background: #fff;
  border-radius: 14px;
  padding: 2.25rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 14px;
  background: var(--color-accent);
  color: var(--color-primary-dark);
  font-size: 1.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  color: var(--color-primary);
  font-size: 1.4rem;
}
.sub {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.88rem;
}
form {
  text-align: left;
}
.pw-wrap {
  position: relative;
}
.pw-toggle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.login-error {
  background: #fef2f2;
  color: var(--color-danger);
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
}
.submit {
  width: 100%;
  margin-top: 0.5rem;
}
.hint {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: var(--color-bg);
  border-radius: 8px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
</style>
