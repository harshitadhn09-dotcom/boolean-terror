import type { CSSProperties } from 'react';

export const cardStyle: CSSProperties = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: '20px',
  padding: '36px 32px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

export const headerStyle: CSSProperties = {
  color: '#fff',
  fontSize: '22px',
  fontWeight: '700',
  marginBottom: '8px',
};

export const labelStyle: CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '12px',
};

export const inputStyle: CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#ffffff',
  padding: '12px 14px',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
};

export const chipContainerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '6px',
};

export function chipStyle(active: boolean): CSSProperties {
  return {
    background: active ? '#52a447' : '#1a1a1a',
    border: `1px solid ${active ? '#52a447' : '#333'}`,
    color: '#ffffff',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  };
}

export const buttonStyle: CSSProperties = {
  marginTop: '24px',
  background: '#52a447',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(82,164,71,0.2)',
  width: '100%',
};

export const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: '24px',
};

export const backButtonStyle: CSSProperties = {
  flex: 1,
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
};

export const nextButtonStyle: CSSProperties = {
  flex: 2,
  background: '#52a447',
  border: 'none',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(82,164,71,0.2)',
};
