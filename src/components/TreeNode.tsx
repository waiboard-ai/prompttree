import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { TreeNode } from '../types';

// Natural colors for tree stages
const stageConfig = {
  seed: {
    size: 24,
    color: '#8B4513',
    bgGradient: 'linear-gradient(145deg, #A0522D, #654321)',
    emoji: '🌰',
  },
  sprout: {
    size: 32,
    color: '#228B22',
    bgGradient: 'linear-gradient(145deg, #32CD32, #228B22)',
    emoji: '🌱',
  },
  branch: {
    size: 40,
    color: '#2E8B57',
    bgGradient: 'linear-gradient(145deg, #3CB371, #2E8B57)',
    emoji: '🌿',
  },
  flower: {
    size: 48,
    color: '#FF69B4',
    bgGradient: 'linear-gradient(145deg, #FFB6C1, #FF69B4)',
    emoji: '🌸',
  },
  fruit: {
    size: 52,
    color: '#DC143C',
    bgGradient: 'linear-gradient(145deg, #FF6347, #DC143C)',
    emoji: '🍎',
  },
};

const TreeNodeComponent = memo(({ data, selected }: NodeProps<TreeNode>) => {
  const stage = data?.stage || 'seed';
  const config = stageConfig[stage];
  const size = config.size;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Bottom handle - connects to parent (trunk/root) */}
      <Handle
        type="target"
        position={Position.Bottom}
        style={{
          background: '#654321',
          border: '2px solid #8B4513',
          width: 10,
          height: 10,
          bottom: -5,
        }}
      />

      {/* Top handle - connects to children (branches) */}
      <Handle
        type="source"
        position={Position.Top}
        style={{
          background: '#228B22',
          border: '2px solid #32CD32',
          width: 8,
          height: 8,
          top: -4,
        }}
      />

      {/* Tree node body */}
      <motion.div
        animate={selected ? { scale: 1.15 } : { scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: size,
          height: size,
          borderRadius: stage === 'seed' ? '40% 40% 50% 50%' : '50%',
          background: config.bgGradient,
          boxShadow: selected
            ? `0 0 20px ${config.color}, 0 4px 15px rgba(0,0,0,0.4)`
            : `0 3px 10px rgba(0,0,0,0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `3px solid ${selected ? '#fff' : 'rgba(255,255,255,0.3)'}`,
        }}
      >
        {/* Emoji */}
        <motion.span
          animate={
            stage === 'flower' || stage === 'fruit'
              ? { scale: [1, 1.05, 1] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: size * 0.55,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
          }}
        >
          {config.emoji}
        </motion.span>
      </motion.div>

      {/* Subtle glow for flowers and fruit */}
      {(stage === 'flower' || stage === 'fruit') && (
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${config.color}50 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </motion.div>
  );
});

TreeNodeComponent.displayName = 'TreeNode';

export default TreeNodeComponent;
