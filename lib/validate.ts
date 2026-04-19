/**
 * Hand-rolled validator with a zod-shaped API.
 *
 * Rationale: npm install is blocked in our current build environment,
 * so we can't pull in zod today. The API here intentionally mirrors
 * zod's result shape (`{ success, data } | { success, error: { issues } }`)
 * so swapping to real zod later is a small diff:
 *
 *   - Replace `validate.object({ ... })` with `z.object({ ... })`
 *   - Replace `.string()` / `.email()` / `.max(n)` etc. with z equivalents
 *   - Replace `.safeParse(input)` call sites — they already match
 *
 * Keep this file small. Do NOT grow it into a runtime-validation library —
 * when real zod lands, delete this.
 */

export type Issue = { path: (string | number)[]; message: string }
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Issue[] } }

export interface Validator<T> {
  safeParse(input: unknown): ValidationResult<T>
}

type Field<T> = {
  parse: (input: unknown, path: (string | number)[]) => T | { __issues: Issue[] }
  optional?: boolean
  default?: T
}

const isIssues = (v: unknown): v is { __issues: Issue[] } =>
  typeof v === 'object' && v !== null && '__issues' in v

function err(path: (string | number)[], message: string): { __issues: Issue[] } {
  return { __issues: [{ path, message }] }
}

// ────── Primitives ──────

export function string(opts?: { min?: number; max?: number; trim?: boolean }): Field<string> {
  return {
    parse: (input, path) => {
      if (typeof input !== 'string') return err(path, 'expected string')
      const val = opts?.trim ? input.trim() : input
      if (opts?.min !== undefined && val.length < opts.min)
        return err(path, `min length ${opts.min}`)
      if (opts?.max !== undefined && val.length > opts.max)
        return err(path, `max length ${opts.max}`)
      return val
    },
  }
}

export function email(opts?: { max?: number }): Field<string> {
  return {
    parse: (input, path) => {
      if (typeof input !== 'string') return err(path, 'expected string')
      // Minimal RFC-5321-ish check. Not a full email parser.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) return err(path, 'invalid email')
      if (opts?.max !== undefined && input.length > opts.max)
        return err(path, `max length ${opts.max}`)
      return input
    },
  }
}

export function url(opts?: { max?: number }): Field<string> {
  return {
    parse: (input, path) => {
      if (typeof input !== 'string') return err(path, 'expected string')
      try {
        new URL(input)
      } catch {
        return err(path, 'invalid url')
      }
      if (opts?.max !== undefined && input.length > opts.max)
        return err(path, `max length ${opts.max}`)
      return input
    },
  }
}

export function boolean(): Field<boolean> {
  return {
    parse: (input, path) => {
      if (typeof input !== 'boolean') return err(path, 'expected boolean')
      return input
    },
  }
}

export function number(opts?: { min?: number; max?: number; int?: boolean }): Field<number> {
  return {
    parse: (input, path) => {
      const n =
        typeof input === 'number'
          ? input
          : typeof input === 'string' && input.length > 0 && !Number.isNaN(Number(input))
          ? Number(input)
          : NaN
      if (!Number.isFinite(n)) return err(path, 'expected finite number')
      if (opts?.int && !Number.isInteger(n)) return err(path, 'expected integer')
      if (opts?.min !== undefined && n < opts.min) return err(path, `min ${opts.min}`)
      if (opts?.max !== undefined && n > opts.max) return err(path, `max ${opts.max}`)
      return n
    },
  }
}

export function literal<T extends string>(...values: T[]): Field<T> {
  return {
    parse: (input, path) => {
      if (typeof input !== 'string' || !values.includes(input as T))
        return err(path, `expected one of: ${values.join(', ')}`)
      return input as T
    },
  }
}

export function array<T>(item: Field<T>, opts?: { max?: number }): Field<T[]> {
  return {
    parse: (input, path) => {
      if (!Array.isArray(input)) return err(path, 'expected array')
      if (opts?.max !== undefined && input.length > opts.max)
        return err(path, `max length ${opts.max}`)
      const out: T[] = []
      const issues: Issue[] = []
      input.forEach((el, i) => {
        const r = item.parse(el, [...path, i])
        if (isIssues(r)) issues.push(...r.__issues)
        else out.push(r)
      })
      if (issues.length) return { __issues: issues }
      return out
    },
  }
}

// ────── Modifiers ──────

export function optional<T>(f: Field<T>): Field<T | undefined> {
  return {
    parse: (input, path) => {
      if (input === undefined || input === null) return undefined
      return f.parse(input, path) as T
    },
    optional: true,
  }
}

export function withDefault<T>(f: Field<T>, value: T): Field<T> {
  return {
    parse: (input, path) => {
      if (input === undefined || input === null) return value
      return f.parse(input, path) as T
    },
    default: value,
  }
}

// ────── Object composition ──────

type Shape = Record<string, Field<unknown>>
type Infer<S extends Shape> = {
  [K in keyof S]: S[K] extends Field<infer T> ? T : never
}

export function object<S extends Shape>(shape: S): Validator<Infer<S>> {
  return {
    safeParse(input: unknown): ValidationResult<Infer<S>> {
      if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        return { success: false, error: { issues: [{ path: [], message: 'expected object' }] } }
      }
      const obj = input as Record<string, unknown>
      const out: Record<string, unknown> = {}
      const issues: Issue[] = []
      for (const key of Object.keys(shape)) {
        const field = shape[key]
        const raw = obj[key]
        const r = field.parse(raw, [key])
        if (isIssues(r)) issues.push(...r.__issues)
        else out[key] = r
      }
      if (issues.length) return { success: false, error: { issues } }
      return { success: true, data: out as Infer<S> }
    },
  }
}

// ────── Coercion helpers for URL query params (always strings) ──────

export const coerce = {
  number: (opts?: { min?: number; max?: number; int?: boolean }): Field<number> => number(opts),
  boolean: (): Field<boolean> => ({
    parse: (input, path) => {
      if (typeof input === 'boolean') return input
      if (input === 'true' || input === '1') return true
      if (input === 'false' || input === '0') return false
      return err(path, 'expected boolean')
    },
  }),
}
