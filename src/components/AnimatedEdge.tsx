import { type EdgeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { AnimatedEdge } from '../types';

// Generate natural curved branch path
function generateBranchPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): string {
  // Natural tree branches have gentle curves
  const midY = (sourceY + targetY) / 2;
  const controlOffset = (targetX - sourceX) * 0.2;

  return `M ${sourceX} ${sourceY} C ${sourceX + controlOffset} ${midY}, ${targetX - controlOffset} ${midY}, ${targetX} ${targetY}`;
}

export default function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<AnimatedEdge>) {
  const isNew = data?.isNew ?? false;
  const edgePath = generateBranchPath(sourceX, sourceY, targetX, targetY);

  // Branch thickness varies slightly
  const thickness = 4 + Math.random() * 2;

  return (
    <g>
      {/* Branch shadow */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={thickness + 2}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ filter: 'blur(2px)' }}
      />

      {/* Main branch - wood colored */}
      <motion.path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#branch-gradient-${id})`}
        strokeWidth={thickness}
        strokeLinecap="round"
        initial={isNew ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.6, ease: 'easeOut' },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Inner wood grain highlight */}
      <motion.path
        d={edgePath}
        fill="none"
        stroke="rgba(160,82,45,0.4)"
        strokeWidth={thickness * 0.4}
        strokeLinecap="round"
        strokeDasharray="8 12"
        initial={isNew ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />

      {/* Gradient for natural wood look */}
      <defs>
        <linearGradient
          id={`branch-gradient-${id}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="30%" stopColor="#A0522D" />
          <stop offset="70%" stopColor="#654321" />
          <stop offset="100%" stopColor="#8B4513" />
        </linearGradient>
      </defs>
    </g>
  );
}
