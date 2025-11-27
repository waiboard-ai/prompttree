import { type EdgeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { AnimatedEdge } from '../types';
import { useTreeStore } from '../store/treeStore';
import { getThemeById, type TreeTheme } from '../themes/treeThemes';

// Generate organic curved path that looks like a tree branch
function generateOrganicPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  style: TreeTheme['branch']['style']
): string {
  const midY = (sourceY + targetY) / 2;
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;

  switch (style) {
    case 'organic': {
      // Natural tree branch with slight curves
      const wobble1 = Math.sin(sourceX * 0.1) * 15;
      const wobble2 = Math.cos(targetX * 0.1) * 15;
      const cp1x = sourceX + wobble1;
      const cp1y = sourceY + deltaY * 0.3;
      const cp2x = targetX + wobble2;
      const cp2y = targetY - deltaY * 0.3;
      return `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
    }

    case 'vine': {
      // Winding vine-like path
      const segments = 3;
      let path = `M ${sourceX} ${sourceY}`;
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const x = sourceX + deltaX * t;
        const y = sourceY + deltaY * t;
        const wave = Math.sin(t * Math.PI * 2) * 20 * (1 - t);
        path += ` Q ${x + wave} ${y - deltaY / (segments * 2)}, ${x} ${y}`;
      }
      return path;
    }

    case 'electric': {
      // Jagged electric/lightning path
      const points: [number, number][] = [[sourceX, sourceY]];
      const steps = 5;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const x = sourceX + deltaX * t + (Math.random() - 0.5) * 30;
        const y = sourceY + deltaY * t;
        points.push([x, y]);
      }
      points.push([targetX, targetY]);
      return `M ${points.map(p => p.join(' ')).join(' L ')}`;
    }

    case 'straight':
    default: {
      // Simple bezier curve
      return `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
    }
  }
}

export default function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<AnimatedEdge>) {
  const themeId = useTreeStore(s => s.currentTheme);
  const theme = getThemeById(themeId);

  const isNew = data?.isNew ?? false;

  // Generate themed path
  const edgePath = generateOrganicPath(sourceX, sourceY, targetX, targetY, theme.branch.style);

  // Calculate path length for particles
  const pathLength = Math.sqrt(
    Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
  );

  // Number of flowing particles based on path length
  const particleCount = Math.max(2, Math.floor(pathLength / 80));

  return (
    <g>
      {/* Multiple glow layers for depth */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={theme.branch.glowColor}
        strokeWidth={theme.branch.thickness * 4}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        style={{ filter: 'blur(8px)' }}
      />

      <motion.path
        d={edgePath}
        fill="none"
        stroke={theme.branch.glowColor}
        strokeWidth={theme.branch.thickness * 2.5}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        style={{ filter: 'blur(4px)' }}
      />

      {/* Main branch path */}
      <motion.path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#branch-gradient-${id})`}
        strokeWidth={theme.branch.thickness}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.8, ease: 'easeOut' },
          opacity: { duration: 0.3 },
        }}
        style={{
          filter: `drop-shadow(0 0 ${theme.ambient.glowIntensity * 4}px ${theme.branch.glowColor})`,
        }}
      />

      {/* Inner highlight line */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={theme.branch.thickness * 0.3}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Flowing energy particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.circle
          key={i}
          r={3 + Math.random() * 2}
          fill={theme.branch.particleColor}
          initial={{ offsetDistance: '0%', opacity: 0 }}
          animate={{
            offsetDistance: '100%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: i * (2 / particleCount),
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            offsetPath: `path('${edgePath}')`,
            filter: `drop-shadow(0 0 4px ${theme.branch.particleColor})`,
          }}
        />
      ))}

      {/* Pulsing node at connection points */}
      <motion.circle
        cx={sourceX}
        cy={sourceY}
        r={4}
        fill={theme.branch.glowColor}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          filter: `drop-shadow(0 0 4px ${theme.branch.glowColor})`,
        }}
      />

      {/* Gradient definition for this edge */}
      <defs>
        <linearGradient
          id={`branch-gradient-${id}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={theme.branch.color}>
            <animate
              attributeName="stop-color"
              values={`${theme.branch.color};${theme.branch.glowColor};${theme.branch.color}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor={theme.branch.glowColor} />
          <stop offset="100%" stopColor={theme.branch.color}>
            <animate
              attributeName="stop-color"
              values={`${theme.branch.color};${theme.branch.glowColor};${theme.branch.color}`}
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </g>
  );
}
