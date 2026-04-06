'use client';

import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Swipe', href: '/swipe' },
  { label: 'Matches', href: '/matches' },
  { label: 'Profile', href: '/profile' },
] as const;

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

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
        Match<span style={{ color: '#52a447' }}>a</span>
      </h1>

      <div style={{ display: 'flex', gap: '8px' }}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            style={{
              background: path === link.href ? '#52a447' : 'transparent',
              border: `1px solid ${path === link.href ? '#52a447' : '#333'}`,
              color: path === link.href ? '#fff' : '#aaa',
              borderRadius: '8px',
              padding: '7px 18px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}