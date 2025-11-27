import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { TreeNode, NodeStage } from '../types';

const stageConfig: Record<NodeStage, { emoji: string; color: string; glow: string; size: number }> = {
  seed: { emoji: '🌱', color: '#8B4513', glow: '#654321', size: 50 },
  sprout: { emoji: '🌿', color: '#228B22', glow: '#32CD32', size: 55 },
  branch: { emoji: '🌳', color: '#2E8B57', glow: '#3CB371', size: 60 },
  flower: { emoji: '🌸', color: '#FF69B4', glow: '#FFB6C1', size: 65 },
  fruit: { emoji: '🍎', color: '#FF4500', glow: '#FF6347', size: 70 },
};

const TreeNodeComponent = memo(({ data, selected }: NodeProps<TreeNode>) => {
  const config = stageConfig[data.stage];

  return (
    <motion.div
      initial={data.isNew ? { scale: 0, opacity: 0, rotate: -180 } : false}
      animate={{
        scale: selected ? 1.2 : 1,
        opacity: 1,
        rotate: 0,
      }}
      whileHover={{
        scale: 1.15,
        transition: { type: 'spring', stiffness: 400 }
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.6
      }}
      style={{
        width: config.size,
        height: config.size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${config.glow}, ${config.color})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: config.size * 0.5,
        boxShadow: selected
          ? `0 0 30px ${config.glow}, 0 0 60px ${config.glow}50`
          : `0 0 20px ${config.glow}80`,
        border: `3px solid ${config.glow}`,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Pulsing ring animation */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `2px solid ${config.glow}`,
        }}
      />

      {/* Emoji */}
      <motion.span
        animate={{
          y: [0, -3, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {config.emoji}
      </motion.span>

      {/* Energy bar */}
      <div style={{
        position: 'absolute',
        bottom: -12,
        width: '80%',
        height: 6,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.energy}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, #4ade80, #22c55e)`,
            borderRadius: 3,
          }}
        />
      </div>

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: config.glow,
          width: 8,
          height: 8,
          border: 'none',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: config.glow,
          width: 8,
          height: 8,
          border: 'none',
        }}
      />
    </motion.div>
  );
});

TreeNodeComponent.displayName = 'TreeNode';

export default TreeNodeComponent;
