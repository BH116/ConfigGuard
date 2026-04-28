'use client';
import { useTheme } from 'next-themes';
export function ThemeToggle() { const { theme, setTheme } = useTheme(); return <button className="rounded border px-2 py-1" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Theme</button>; }
