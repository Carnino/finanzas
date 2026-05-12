export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
}

export const CATEGORIES = {
  expense: [
    'Vivienda',
    'Alimentación',
    'Transporte',
    'Salud',
    'Educación',
    'Entretenimiento',
    'Compras',
    'Servicios',
    'Inversiones',
    'Otros',
  ],
  income: ['Sueldo', 'Inversiones', 'Regalos', 'Ventas', 'Otros', 'Devoluciones'],
} as const;

export const CATEGORY_ICONS: Record<string, string> = {
  Vivienda: '🏠',
  Alimentación: '🍽️',
  Transporte: '🚗',
  Salud: '🩺',
  Educación: '📚',
  Entretenimiento: '🎬',
  Compras: '🛍️',
  Servicios: '🔌',
  Sueldo: '💼',
  Inversiones: '📈',
  Regalos: '🎁',
  Ventas: '🏷️',
  Otros: '✨',
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);
