import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SessionUser } from '@/types'
import { ADMIN_USERS, hashPassword } from '@/auth/credentials'

const STORAGE_KEY = 'gs_admin_session'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser | null>(loadSession())

  const isAuthenticated = computed(() => user.value !== null)

  function loadSession(): SessionUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as SessionUser) : null
    } catch {
      return null
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    const found = ADMIN_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
    )
    if (!found) return false

    const hash = await hashPassword(password)
    if (hash !== found.passwordHash) return false

    const session: SessionUser = {
      id: found.id,
      username: found.username,
      displayName: found.displayName,
      role: found.role,
    }
    user.value = session
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    return true
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isAuthenticated, login, logout }
})
