// ── Typed API response helpers ─────────────────────────────
// Keeps route handlers clean and consistent.

export function ok<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return err(message, 401);
}

export function notFound(message = "Not found") {
  return err(message, 404);
}

export function forbidden(message = "Forbidden") {
  return err(message, 403);
}
