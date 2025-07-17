export type ValidationResult<T> =
  | { ok: true; query: T }
  | { ok: false; error: string };
