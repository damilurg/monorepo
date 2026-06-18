export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

export interface CurrencyOption {
  code: string;
  label: string;
}

export const POPULAR_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', label: 'Доллар США' },
  { code: 'EUR', label: 'Евро' },
  { code: 'RUB', label: 'Российский рубль' },
  { code: 'GBP', label: 'Британский фунт' },
  { code: 'JPY', label: 'Японская иена' },
  { code: 'CNY', label: 'Китайский юань' },
  { code: 'CHF', label: 'Швейцарский франк' },
  { code: 'AUD', label: 'Австралийский доллар' },
  { code: 'CAD', label: 'Канадский доллар' },
  { code: 'TRY', label: 'Турецкая лира' },
];
