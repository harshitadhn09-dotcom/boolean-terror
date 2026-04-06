'use client';

import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: '84px',
          fontWeight: '900',
          margin: 0,
          letterSpacing: '-3px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            textShadow:
              '0px 4px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.2)',
          }}
        >
          Match
        </span>
        <span
          style={{
            color: '#52a447',
            textShadow:
              '0px 4px 8px rgba(0,0,0,0.9), 0 0 20px rgba(82,164,71,0.4)',
          }}
        >
          a
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          color: '#e0e0e0',
          fontSize: '18px',
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        Find your perfect hackathon teammate
      </motion.p>
    </>
  );
}
