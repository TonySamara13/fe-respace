const HAS_OFFSET = /(?:Z|[+-]\d{2}:\d{2})$/;

export function parseUtc(value: string): Date {
  const normalized = HAS_OFFSET.test(value) ? value : `${value}Z`;
  return new Date(normalized);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "short" }).format(parseUtc(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parseUtc(value));
}
