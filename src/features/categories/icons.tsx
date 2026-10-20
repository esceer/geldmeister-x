import {
  Baby,
  Car,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  PawPrint,
  PiggyBank,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  Smartphone,
  Utensils,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react-native';
import { createElement } from 'react';

// Icon keys stored in categories.icon.
export const categoryIcons: Record<string, LucideIcon> = {
  receipt: Receipt,
  car: Car,
  'shopping-bag': ShoppingBag,
  house: House,
  utensils: Utensils,
  'heart-pulse': HeartPulse,
  plane: Plane,
  gift: Gift,
  shirt: Shirt,
  'gamepad-2': Gamepad2,
  'graduation-cap': GraduationCap,
  'paw-print': PawPrint,
  baby: Baby,
  dumbbell: Dumbbell,
  smartphone: Smartphone,
  'piggy-bank': PiggyBank,
};

export const categoryColors = [
  '#8E9BFF',
  '#3DDCC5',
  '#FFB547',
  '#FF7DB5',
  '#7FD7FF',
  '#B892FF',
  '#FF8A65',
  '#9BE15D',
  '#F4D35E',
];

export function CategoryIcon({ icon, ...props }: LucideProps & { icon: string }) {
  return createElement(categoryIcons[icon] ?? ShoppingBag, props);
}

/** Category color with alpha (default 16%), for tinted tiles. */
export const tint = (hex: string, alpha = 0.16) =>
  hex +
  Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
