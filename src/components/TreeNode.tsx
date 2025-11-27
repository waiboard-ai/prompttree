import { memo, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import type { TreeNode, NodeStage } from '../types';

const stageConfig: Record<NodeStage, { emoji: string; color: string; glow: string; size: number; particleCount: number }> = {
  seed: { emoji: '🌱', color: '#8B4513', glow: '#654321', size: 50, particleCount: 2 },
  sprout: { emoji: '🌿', color: '#228B22', glow: '#32CD32', size: 55, particleCount: 3 },
  branch: { emoji: '🌳', color: '#2E8B57', glow: '#3CB371', size: 60, particleCount: 4 },
  flower: { emoji: '🌸', color: '#FF69B4', glow: '#FFB6C1', size: 65, particleCount: 5 },
  fruit: { emoji: '🍎', color: '#FF4500', glow: '#FF6347', size: 70, particleCount: 6 },
};

// Floating particles for visual effect
const FloatingParticle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      y: [-20, -40],
      x: [0, (Math.random() - 0.5) * 30],
      scale: [0, 1, 0.5],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
    style={{
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`,
      pointerEvents: 'none',
    }}
  />
);

const TreeNodeComponent = memo(({ data, selected }: NodeProps<TreeNode>) => {
  const config = stageConfig[data.stage];
  const [prevStage, setPrevStage] = useState(data.stage);
  const [isEvolving, setIsEvolving] = useState(false);

  // Smooth spring for size transitions
  const springSize = useSpring(config.size, {
    stiffness: 300,
    damping: 30,
  });

  // Detect stage changes for evolution animation
  useEffect(() => {
    if (data.stage !== prevStage) {
      setIsEvolving(true);
      setPrevStage(data.stage);
      const timer = setTimeout(() => setIsEvolving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [data.stage, prevStage]);

  // Update spring when config changes
  useEffect(() => {
    springSize.set(config.size);
  }, [config.size, springSize]);

  const currentSize = useTransform(springSize, (s) => s);

  return (
    <motion.div
      layout
      layoutId={`node-${data.label}`}
      initial={data.isNew ? { scale: 0, opacity: 0, rotate: -180 } : false}
      animate={{
        scale: selected ? 1.15 : isEvolving ? 1.2 : 1,
        opacity: 1,
        rotate: 0,
      }}
      whileHover={{
        scale: 1.1,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      style={{
        width: currentSize,
        height: currentSize,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Background with smooth color transition */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 30% 30%, ${config.glow}, ${config.color})`,
          boxShadow: selected
            ? `0 0 30px ${config.glow}, 0 0 60px ${config.glow}50`
            : `0 0 20px ${config.glow}80`,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `3px solid ${config.glow}`,
        }}
      />

      {/* Evolution burst effect */}
      <AnimatePresence>
        {isEvolving && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${config.glow}80 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating particles */}
      {Array.from({ length: config.particleCount }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.4}
          color={config.glow}
        />
      ))}

      {/* Pulsing ring animation */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `2px solid ${config.glow}`,
          pointerEvents: 'none',
        }}
      />

      {/* Second pulsing ring (offset) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{
          duration: 2.5,
          delay: 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `1px solid ${config.glow}`,
          pointerEvents: 'none',
        }}
      />

      {/* Emoji with bounce animation */}
      <motion.span
        key={data.stage} // Re-mount on stage change for fresh animation
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          y: [0, -2, 0],
        }}
        transition={{
          scale: { type: 'spring', stiffness: 500, damping: 15 },
          rotate: { type: 'spring', stiffness: 500, damping: 15 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          fontSize: config.size * 0.5,
          zIndex: 1,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      >
        {config.emoji}
      </motion.span>

      {/* Energy bar */}
      <div style={{
        position: 'absolute',
        bottom: -14,
        width: '90%',
        height: 6,
        background: 'rgba(0,0,0,0.6)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.energy}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, #22c55e, #4ade80, #86efac)`,
            borderRadius: 3,
            boxShadow: '0 0 8px #4ade8080',
          }}
        />
      </div>

      {/* Label tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: -28,
          background: 'rgba(0,0,0,0.8)',
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 11,
          color: '#fff',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: `1px solid ${config.glow}50`,
        }}
      >
        {data.label}
      </motion.div>

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: config.glow,
          width: 10,
          height: 10,
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: `0 0 6px ${config.glow}`,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: config.glow,
          width: 10,
          height: 10,
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: `0 0 6px ${config.glow}`,
        }}
      />
    </motion.div>
  );
});

TreeNodeComponent.displayName = 'TreeNode';

export default TreeNodeComponent;
