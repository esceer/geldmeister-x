import { Car, Receipt, ShoppingBag, type LucideIcon, type LucideProps } from 'lucide-react-native';
import { createElement } from 'react';

// Icon keys stored in categories.icon.
export const categoryIcons: Record<string, LucideIcon> = {
  receipt: Receipt,
  car: Car,
  'shopping-bag': ShoppingBag,
};

export function CategoryIcon({ icon, ...props }: LucideProps & { icon: string }) {
  return createElement(categoryIcons[icon] ?? ShoppingBag, props);
}

/** Category color with alpha (default 16%), for tinted tiles. */
export const tint = (hex: string, alpha = 0.16) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
