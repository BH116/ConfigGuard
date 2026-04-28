import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 } as const;
