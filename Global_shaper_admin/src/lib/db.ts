import { supabase } from './supabase'

/**
 * Convierte `undefined` en `null`. JSON.stringify omite los `undefined`, así que
 * sin esto un campo que el usuario vació no se limpiaría en la base de datos.
 */
export function nullify(obj: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v]),
  )
}

/** Reemplaza (o agrega) una fila en una lista local por su id. */
export function upsertLocal<T extends { id: string }>(list: T[], row: T) {
  const idx = list.findIndex((x) => x.id === row.id)
  if (idx === -1) list.unshift(row)
  else list[idx] = row
}

const RLS_HINT =
  'No se pudo guardar: el registro no existe o no tienes permisos (revisa las políticas RLS).'

/** CRUD mínimo sobre una tabla de Supabase. */
export function table<T extends { id: string }>(
  name: string,
  order?: { column: string; ascending?: boolean },
) {
  return {
    async list(): Promise<T[]> {
      let query = supabase.from(name).select('*')
      if (order) query = query.order(order.column, { ascending: order.ascending ?? true })
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return (data ?? []) as T[]
    },

    async insert(payload: object): Promise<T> {
      const { data, error } = await supabase
        .from(name)
        .insert(nullify(payload))
        .select()
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) throw new Error(RLS_HINT)
      return data as T
    },

    async update(id: string, payload: object): Promise<T> {
      const { data, error } = await supabase
        .from(name)
        .update(nullify(payload))
        .eq('id', id)
        .select()
        .maybeSingle()
      if (error) throw new Error(error.message)
      if (!data) throw new Error(RLS_HINT)
      return data as T
    },

    async remove(id: string): Promise<void> {
      // RLS no devuelve error cuando bloquea un DELETE: simplemente borra 0 filas.
      const { data, error } = await supabase.from(name).delete().eq('id', id).select('id')
      if (error) throw new Error(error.message)
      if (!data || data.length === 0) throw new Error(RLS_HINT)
    },
  }
}
