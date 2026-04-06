'use client';

import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';

export function GithubVerifiedBadge({ marginTop }: { marginTop?: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#1a1a1a',
        border: '1px solid #b8860b',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        color: '#ffd700',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        width: 'fit-content',
        marginTop,
      }}
    >
      GITHUB VERIFIED
    </div>
  );
}

export function ContactButton({
  href,
  children,
  style,
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  style: CSSProperties;
  target?: string;
  rel?: string;
}) {
  return (
    <a href={href} target={target} rel={rel} style={style}>
      {children}
    </a>
  );
}
