import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let counter = 0

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Ocurrió un error inesperado'
}

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  /**
   * Ejecuta una operación async. Muestra toast de éxito o de error
   * y devuelve true si terminó bien.
   */
  async function attempt(fn: () => Promise<unknown>, successMessage?: string): Promise<boolean> {
    try {
      await fn()
      if (successMessage) show(successMessage, 'success')
      return true
    } catch (e) {
      show(errorMessage(e), 'error', 5000)
      return false
    }
  }

  return {
    toasts,
    dismiss,
    attempt,
    success: (m: string) => show(m, 'success'),
    error: (m: string) => show(m, 'error'),
    info: (m: string) => show(m, 'info'),
  }
}
