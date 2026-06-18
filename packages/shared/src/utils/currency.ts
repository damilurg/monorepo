export function formatCurrency(
  amount: number,
  currency: string,
  locale = 'ru-RU'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatNumber(
  value: number,
  locale = 'ru-RU',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function roundRate(rate: number, decimals = 4): number {
  return Math.round(rate * 10 ** decimals) / 10 ** decimals;
}
