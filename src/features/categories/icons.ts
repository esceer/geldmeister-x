import { Car, Receipt, ShoppingBag, type LucideIcon } from 'lucide-react-native';

// Icon keys stored in categories.icon.
export const categoryIcons: Record<string, LucideIcon> = {
  receipt: Receipt,
  car: Car,
  'shopping-bag': ShoppingBag,
};

export const categoryIcon = (key: string): LucideIcon => categoryIcons[key] ?? ShoppingBag;

/** Category color at 16% alpha, for tinted tiles. */
export const tint = (hex: string, alpha = 0.16) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
