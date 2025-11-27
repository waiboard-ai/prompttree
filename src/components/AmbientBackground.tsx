import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTreeStore } from '../store/treeStore';
import { getThemeById } from '../themes/treeThemes';

// Particle shapes for different themes
const getParticleShape = (type: string, size: number) => {
  switch (type) {
    case 'leaves':
      return {
        width: size * 1.5,
        height: size,
        borderRadius: '50% 0 50% 50%',
        rotate: Math.random() * 360,
      };
    case 'petals':
      return {
        width: size,
        height: size * 1.2,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        rotate: Math.random() * 360,
      };
    case 'snow':
      return {
        width: size,
        height: size,
        borderRadius: '50%',
        rotate: 0,
      };
    case 'sparks':
      return {
        width: size * 0.5,
        height: size * 2,
        borderRadius: '50%',
        rotate: Math.random() * 360,
      };
    case 'fireflies':
      return {
        width: size,
        height: size,
        borderRadius: '50%',
        rotate: 0,
      };
    default:
      return {
        width: size,
        height: size,
        borderRadius: '50%',
        rotate: 0,
      };
  }
};

interface ParticleProps {
  color: string;
  type: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  size: number;
}

const Particle = ({ color, type, delay, duration, startX, startY, size }: ParticleProps) => {
  const shape = getParticleShape(type, size);

  // Different animations based on particle type
  const getAnimation = () => {
    switch (type) {
      case 'leaves':
      case 'petals':
        return {
          y: [startY, startY + 500],
          x: [startX, startX + (Math.random() - 0.5) * 200],
          rotate: [shape.rotate, shape.rotate + 720],
          opacity: [0, 0.8, 0.8, 0],
        };
      case 'snow':
        return {
          y: [startY, startY + 400],
          x: [startX, startX + Math.sin(startY * 0.01) * 100],
          opacity: [0, 0.9, 0.9, 0],
        };
      case 'sparks':
        return {
          y: [startY, startY - 300],
          x: [startX, startX + (Math.random() - 0.5) * 150],
          scale: [0, 1.5, 0],
          opacity: [0, 1, 0],
        };
      case 'fireflies':
        return {
          y: [startY, startY + Math.sin(delay * 10) * 100, startY],
          x: [startX, startX + Math.cos(delay * 10) * 100, startX],
          scale: [0.5, 1.2, 0.5],
          opacity: [0.3, 1, 0.3],
        };
      default:
        return {
          y: [startY, startY + 300],
          opacity: [0, 0.7, 0],
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={getAnimation()}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: type === 'fireflies' ? 'easeInOut' : 'linear',
      }}
      style={{
        position: 'absolute',
        width: shape.width,
        height: shape.height,
        borderRadius: shape.borderRadius,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: 'none',
        transform: `rotate(${shape.rotate}deg)`,
      }}
    />
  );
};

// Grid dot background
const DotGrid = ({ color }: { color: string }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      pointerEvents: 'none',
      opacity: 0.5,
    }}
  />
);

export default function AmbientBackground() {
  const themeId = useTreeStore(s => s.currentTheme);
  const theme = getThemeById(themeId);

  // Generate particles
  const particles = useMemo(() => {
    if (theme.ambient.particles === 'none') return [];

    const count = theme.ambient.particles === 'fireflies' ? 15 : 30;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: theme.ambient.particleColors[i % theme.ambient.particleColors.length],
      startX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      startY: theme.ambient.particles === 'sparks'
        ? (typeof window !== 'undefined' ? window.innerHeight : 600) + 50
        : -50,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
    }));
  }, [themeId, theme.ambient.particleColors, theme.ambient.particles]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.background.gradient,
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${theme.branch.glowColor}15 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${theme.ambient.particleColors[0]}10 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid */}
      <DotGrid color={theme.background.dotColor} />

      {/* Ambient particles */}
      {particles.map((p) => (
        <Particle
          key={p.id}
          color={p.color}
          type={theme.ambient.particles}
          delay={p.delay}
          duration={p.duration}
          startX={p.startX}
          startY={p.startY}
          size={p.size}
        />
      ))}

      {/* Vignette effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
