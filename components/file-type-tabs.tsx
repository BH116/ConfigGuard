'use client';
import { FileType } from '@/lib/rules/types';

const types: FileType[] = ['auto', 'cursor', 'claude', 'agents-md', 'aider', 'mcp'];

export function FileTypeTabs({ value, onChange }: { value: FileType; onChange: (f: FileType) => void }) {
  return <div className="flex flex-wrap gap-2">{types.map((t) => <button className={`rounded border px-2 py-1 text-sm ${value===t ? 'bg-slate-200 dark:bg-slate-700' : ''}`} key={t} onClick={() => onChange(t)}>{t}</button>)}</div>;
}
