'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  const links = [
    { label: 'Swipe', href: '/swipe' },
    { label: 'Matches', href: '/matches' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#0a0a0a',
        borderBottom: '1px solid #1f1f1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '56px',
        zIndex: 50,
      }}
    >
      <h1
        onClick={() => router.push('/')}
        style={{
          color: '#fff',
          fontSize: '20px',
          fontWeight: '700',
          margin: 0,
          cursor: 'pointer',
          letterSpacing: '-1px',
        }}
      >
        Dev<span style={{ color: '#52a447' }}>Match</span>
      </h1>

      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => router.push(l.href)}
            style={{
              background: path === l.href ? '#52a447' : 'transparent',
              border: `1px solid ${path === l.href ? '#52a447' : '#333'}`,
              color: path === l.href ? '#fff' : '#aaa',
              borderRadius: '8px',
              padding: '7px 18px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
