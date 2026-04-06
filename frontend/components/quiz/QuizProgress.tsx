'use client';

interface QuizProgressProps {
  currentSkillIdx: number;
  skills: string[];
  marginBottom: string;
}

export default function QuizProgress({
  currentSkillIdx,
  skills,
  marginBottom,
}: QuizProgressProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom }}>
      {skills.map((skill, index) => (
        <div
          key={skill}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: '3px',
              width: '100%',
              background: index <= currentSkillIdx ? '#52a447' : '#222',
              borderRadius: '2px',
              transition: 'all 0.3s',
            }}
          />
          <span
            style={{
              color: index === currentSkillIdx ? '#fff' : '#555',
              fontSize: '12px',
            }}
          >
            {skill}
          </span>
        </div>
      ))}
    </div>
  );
}
