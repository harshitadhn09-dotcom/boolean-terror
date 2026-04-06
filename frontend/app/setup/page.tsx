'use client';

import ProfileForm from '@/components/ProfileForm';

export default function SetupPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        style={{
          color: '#fff',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
        }}
      >
        Dev<span style={{ color: '#52a447' }}>Match</span>
      </h1>
      <p style={{ color: '#aaaaaa', marginBottom: '32px', fontSize: '15px' }}>
        Tell us about yourself
      </p>
      <ProfileForm />
    </main>
  );
}
