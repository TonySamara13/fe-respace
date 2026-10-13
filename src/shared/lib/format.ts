export function formatRub(value: number | string): string {
  const amount = typeof value === "number" ? value : Number(value);
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted}\u00A0₽`;
}
