export type ApiErrorCode =
  | "validation_error"
  | "brief_empty"
  | "unknown_room_type"
  | "unknown_style_preset"
  | "unsupported_content_type"
  | "photo_too_large"
  | "invalid_token"
  | "invalid_code"
  | "code_expired"
  | "weak_password"
  | "unauthorized"
  | "not_found"
  | "email_not_verified"
  | "email_taken"
  | "unknown_token_package"
  | "order_locked"
  | "order_incomplete"
  | "insufficient_tokens"
  | "order_already_paid"
  | "too_many_photos"
  | "photo_not_uploaded"
  | "not_awaiting_extra_photos"
  | "concurrent_modification"
  | "already_verified"
  | "not_applicable"
  | "internal_error"
  | "payment_provider_error"
  | "google_not_configured"
  | (string & {});

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly detail: string;
  readonly extra: Record<string, unknown>;

  constructor(status: number, code: ApiErrorCode, detail: string, extra: Record<string, unknown> = {}) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.extra = extra;
  }
}

export function isApiError(error: unknown, code?: ApiErrorCode): error is ApiError {
  if (!(error instanceof ApiError)) return false;
  return code === undefined || error.code === code;
}

const PROBLEM_KEYS = new Set(["type", "title", "status", "detail", "instance", "code"]);

export function toApiError(status: number, body: unknown): ApiError {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const code = typeof record.code === "string" ? record.code : "internal_error";
    const detail = typeof record.detail === "string" ? record.detail : "Не удалось выполнить запрос";
    const extra: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      if (!PROBLEM_KEYS.has(key)) extra[key] = value;
    }
    return new ApiError(status, code, detail, extra);
  }
  return new ApiError(status, "internal_error", "Не удалось выполнить запрос");
}
