'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { getStoredUserId } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ hackathon_type: '', availability: '', email: '' });

  useEffect(() => {
    async function loadProfile() {
      const userId = getStoredUserId();
      if (!userId) {
        router.push('/setup');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('hackathon_type, availability, email')
        .eq('id', userId)
        .single();

      if (data) {
        setForm({
          hackathon_type: data.hackathon_type || '',
          availability: data.availability || '',
          email: data.email,
        });
      }
      setLoading(false);
    }

    void loadProfile();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to save', error);
      alert('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={mainStyle}>
        <Navbar />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: '#aaaaaa', fontSize: '16px' }}
        >
          Loading profile...
        </motion.p>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <h2 style={{ color: '#fff', fontSize: '24px', margin: '0 0 24px 0' }}>Edit Preferences</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <label style={labelStyle}>Hackathon Type</label>
          <select
            style={inputStyle}
            value={form.hackathon_type}
            onChange={(e) => setForm({ ...form, hackathon_type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="online">Online</option>
            <option value="offline">In-person</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          <label style={labelStyle}>Availability Date & Time (Optional)</label>
          <input
            style={inputStyle}
            type="datetime-local"
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
          />
        </div>

        <button 
          onClick={() => void handleSave()} 
          style={{ ...buttonStyle, opacity: saving ? 0.7 : 1 }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  paddingTop: '72px',
  minHeight: '100vh',
  background: '#0a0a0a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'sans-serif',
};

const cardStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid #222',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '480px',
  marginTop: '48px',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #333',
  background: '#000',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa',
  fontSize: '14px',
  fontWeight: '500',
};

const buttonStyle: React.CSSProperties = {
  background: '#52a447',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '16px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  transition: 'opacity 0.2s',
};