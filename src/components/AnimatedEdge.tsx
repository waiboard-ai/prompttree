import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const isNew = data?.isNew ?? false;

  return (
    <>
      {/* Glow effect */}
      <BaseEdge
        id={`${id}-glow`}
        path={edgePath}
        style={{
          stroke: '#4ade80',
          strokeWidth: 8,
          filter: 'blur(4px)',
          opacity: 0.5,
        }}
      />

      {/* Main edge */}
      <motion.path
        id={id}
        d={edgePath}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth={3}
        initial={isNew ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          filter: 'drop-shadow(0 0 6px #4ade80)',
        }}
      />

      {/* Flowing particles effect */}
      <motion.circle
        r={4}
        fill="#4ade80"
        filter="drop-shadow(0 0 4px #4ade80)"
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('${edgePath}')`,
        }}
      />

      {/* SVG Gradient definition */}
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
    </>
  );
}
