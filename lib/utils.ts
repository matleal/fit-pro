import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Decimal } from '@prisma/client/runtime/library';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts Prisma Decimal to number
 */
export function decimalToNumber(decimal: Decimal | number | null | undefined): number {
  if (decimal === null || decimal === undefined) return 0;
  if (typeof decimal === 'number') return decimal;
  return decimal.toNumber();
}

/**
 * Converts number to Prisma Decimal string
 */
export function numberToDecimal(value: number): string {
  return value.toString();
}
