'use client';
import dynamic from 'next/dynamic';
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export function CapabilityGraph({ danger }: { danger: boolean }) {
  const nodes = [{ id: 'Agent' }, { id: 'Filesystem' }, { id: 'Network' }, { id: 'Shell' }, { id: 'MCP' }, { id: 'Secrets' }, { id: 'Untrusted sources' }];
  const links = [{ source: 'Agent', target: 'Filesystem' }, { source: 'Agent', target: 'Network' }, { source: 'Agent', target: 'Shell' }, { source: 'MCP', target: 'Network' }, { source: 'Filesystem', target: 'Secrets' }, { source: 'Untrusted sources', target: 'Agent' }];
  return <div className="h-72 rounded border">{/* @ts-expect-error lib type */}<ForceGraph2D graphData={{ nodes, links }} linkColor={() => (danger ? 'red' : 'gray')} /></div>;
}
