import type { Role } from '@/types'

export interface AdminUser {
  id: string
  username: string
  passwordHash: string // SHA-256 hex
  displayName: string
  role: Role
}

/**
 * Usuarios de prueba (autenticación simulada sin base de datos).
 *   admin  / shapers2024  -> rol admin
 *   editor / oruro2024    -> rol editor
 * Los hashes son SHA-256 de las contraseñas en texto plano.
 */
export const ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    username: 'admin',
    passwordHash: '7b63b933f615071a44c92b5e0418fde07e26295d3867b71f2621b55cb14090d4',
    displayName: 'Administrador',
    role: 'admin',
  },
  {
    id: '2',
    username: 'editor',
    passwordHash: 'a60c1ea6647ac247a5951136bf36615997122d4d40a51cc764df90e3db349b89',
    displayName: 'Editor',
    role: 'editor',
  },
]

/** Hashea una contraseña con SHA-256 usando Web Crypto API nativa. */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
