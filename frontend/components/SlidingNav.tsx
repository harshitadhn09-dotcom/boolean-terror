'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
}

export interface SlidingNavProps {
  items: NavItem[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function SlidingNav({ items, activeIndex }: SlidingNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeBtn = buttonRefs.current[activeIndex];
    const container = containerRef.current;
    if (!activeBtn || !container) return;

    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setPillStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [activeIndex]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'flex',
          gap: '4px',
          background: '#111111',
          border: '1px solid #222222',
          padding: '6px',
          borderRadius: '40px',
        }}
      >
        {/* Single pill that slides between buttons */}
        <motion.div
          animate={{ left: pillStyle.left, width: pillStyle.width }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            background: '#52a447',
            borderRadius: '30px',
            zIndex: 0,
          }}
        />

        {items.map((item, idx) => (
          <div
            key={item.label}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            style={{
              position: 'relative',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeIndex === idx ? '#ffffff' : '#aaaaaa',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              borderRadius: '30px',
              transition: 'color 0.2s ease',
              zIndex: 1,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
