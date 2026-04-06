'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SKILLS = [
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'TypeScript',
  'Go',
  'Rust',
  'Flutter',
  'ML/AI',
  'DevOps',
  'Figma',
  'SQL',
];
const INTERESTS = [
  'Web3',
  'AI/ML',
  'Open Source',
  'Gaming',
  'FinTech',
  'HealthTech',
  'EdTech',
  'SaaS',
];

export default function ProfileForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    university: '',
    skills: [] as string[],
    level: '',
    interests: [] as string[],
    linkedin: '',
    email: '',
  });

  function toggleChip(field: 'skills' | 'interests', value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.level || form.skills.length === 0) {
      alert(
        'Please fill in name, email, experience level, and at least one skill.',
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.id) {
        localStorage.setItem('userId', data.id);
        router.push('/swipe');
      } else {
        alert('Something went wrong. Try again.');
      }
    } catch {
      alert('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={cardStyle}>
      <h2
        style={{
          color: '#fff',
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '24px',
        }}
      >
        Create Your Profile
      </h2>

      {/* Name */}
      <label style={labelStyle}>Name</label>
      <input
        style={inputStyle}
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
      />

      {/* Gender */}
      <label style={labelStyle}>Gender</label>
      <select
        style={inputStyle}
        value={form.gender}
        onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
      >
        <option value="">Select gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Non-binary</option>
        <option>Prefer not to say</option>
      </select>

      {/* University */}
      <label style={labelStyle}>University</label>
      <input
        style={inputStyle}
        placeholder="Your university"
        value={form.university}
        onChange={(e) => setForm((p) => ({ ...p, university: e.target.value }))}
      />

      {/* Skills */}
      <label style={labelStyle}>Skills</label>
      <div style={chipContainerStyle}>
        {SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleChip('skills', skill)}
            style={chipStyle(form.skills.includes(skill))}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Experience */}
      <label style={labelStyle}>Experience Level</label>
      <select
        style={inputStyle}
        value={form.level}
        onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
      >
        <option value="">Select level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {/* Interests */}
      <label style={labelStyle}>Interests</label>
      <div style={chipContainerStyle}>
        {INTERESTS.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleChip('interests', interest)}
            style={chipStyle(form.interests.includes(interest))}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* LinkedIn */}
      <label style={labelStyle}>LinkedIn URL</label>
      <input
        style={inputStyle}
        placeholder="https://linkedin.com/in/you"
        value={form.linkedin}
        onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
      />

      {/* Email */}
      <label style={labelStyle}>Email</label>
      <input
        style={inputStyle}
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
      />

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading} style={buttonStyle}>
        {loading ? 'Analyzing your dev profile…' : 'Create Profile →'}
      </button>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: '20px',
  padding: '36px 32px',
  width: '100%',
  maxWidth: '480px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const labelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '12px',
};

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#ffffff',
  padding: '12px 14px',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
};

const chipContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '6px',
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#52a447' : '#1a1a1a',
  border: `1px solid ${active ? '#52a447' : '#333'}`,
  color: '#ffffff',
  borderRadius: '20px',
  padding: '6px 14px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.15s',
});

const buttonStyle: React.CSSProperties = {
  marginTop: '24px',
  background: '#52a447',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(255,46,136,0.35)',
  width: '100%',
};
