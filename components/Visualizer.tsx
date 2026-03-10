'use client';

import React from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  const bars = [
    { h1: '25%', h2: '60%', h3: '30%', d: 0.6 },
    { h1: '35%', h2: '80%', h3: '40%', d: 0.8 },
    { h1: '20%', h2: '50%', h3: '25%', d: 0.5 },
    { h1: '40%', h2: '90%', h3: '45%', d: 0.7 },
    { h1: '30%', h2: '70%', h3: '35%', d: 0.9 },
    { h1: '25%', h2: '65%', h3: '30%', d: 0.6 },
    { h1: '35%', h2: '85%', h3: '40%', d: 0.8 },
    { h1: '20%', h2: '55%', h3: '25%', d: 0.5 },
    { h1: '45%', h2: '95%', h3: '50%', d: 0.7 },
    { h1: '30%', h2: '75%', h3: '35%', d: 0.9 },
    { h1: '25%', h2: '60%', h3: '30%', d: 0.6 },
    { h1: '35%', h2: '80%', h3: '40%', d: 0.8 },
  ];

  return (
    <div className="flex items-end justify-center gap-1.5 h-16">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-white/60 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          animate={isPlaying ? {
            height: [bar.h1, bar.h2, bar.h3],
            opacity: [0.4, 0.8, 0.4],
            backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']
          } : {
            height: '4px',
            opacity: 0.2,
            backgroundColor: 'rgba(255,255,255,0.2)'
          }}
          transition={{
            duration: bar.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  );
};
