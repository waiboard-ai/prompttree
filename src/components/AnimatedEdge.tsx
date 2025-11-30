import { type EdgeProps, getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { AnimatedEdge } from '../types';

export default function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<AnimatedEdge>) {
  const isNew = data?.isNew ?? false;

  // Get the bezier path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate distance for thickness variation
  const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));

  // Thicker at source (closer to trunk), thinner toward tips
  const depth = (data as { depth?: number })?.depth || 0;
  const sourceThickness = Math.max(8, 20 - depth * 4);

  // Wood colors - darker bark on outside, lighter inside
  const barkColor = '#4a3728';
  const woodColor = '#6b4423';
  const highlightColor = '#8b6914';

  return (
    <g>
      {/* Bark shadow - gives depth */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={sourceThickness + 4}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0, opacity: 0 } : {}}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ filter: 'blur(3px)' }}
      />

      {/* Main branch - outer bark */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={barkColor}
        strokeWidth={sourceThickness}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0, opacity: 0 } : {}}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Inner wood layer */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={woodColor}
        strokeWidth={sourceThickness * 0.7}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0 } : {}}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />

      {/* Wood grain highlight */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke={highlightColor}
        strokeWidth={sourceThickness * 0.3}
        strokeLinecap="round"
        strokeDasharray="15 25"
        initial={isNew ? { pathLength: 0, opacity: 0 } : { opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Small knots/texture on branches */}
      {distance > 60 && (
        <motion.circle
          cx={sourceX + (targetX - sourceX) * 0.4}
          cy={sourceY + (targetY - sourceY) * 0.4}
          r={sourceThickness * 0.25}
          fill={barkColor}
          initial={isNew ? { scale: 0 } : {}}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
      )}

      {/* Growing tip animation */}
      {isNew && (
        <motion.circle
          cx={targetX}
          cy={targetY}
          r={6}
          fill="#90EE90"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Gradient definition */}
      <defs>
        <linearGradient id={`bark-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={barkColor} />
          <stop offset="50%" stopColor={woodColor} />
          <stop offset="100%" stopColor={barkColor} />
        </linearGradient>
      </defs>
    </g>
  );
}
