import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { TreeNode } from '../types';

// Leaf component - realistic leaf shape
const Leaf = ({ delay = 0, size = 12, rotation = 0 }: { delay?: number; size?: number; rotation?: number }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.4, type: 'spring' }}
    style={{
      position: 'absolute',
      width: size,
      height: size * 1.4,
      background: 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #228B22 100%)',
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      transform: `rotate(${rotation}deg)`,
      boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.1)',
    }}
  >
    {/* Leaf vein */}
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '20%',
      width: 1,
      height: '60%',
      background: 'rgba(0,100,0,0.4)',
      transform: 'translateX(-50%)',
    }} />
  </motion.div>
);

// Flower petal
const Petal = ({ angle, delay }: { angle: number; delay: number }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.3, type: 'spring' }}
    style={{
      position: 'absolute',
      width: 14,
      height: 20,
      background: 'linear-gradient(180deg, #FFB6C1 0%, #FF69B4 100%)',
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      transformOrigin: 'center bottom',
      transform: `rotate(${angle}deg) translateY(-8px)`,
      boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.1)',
    }}
  />
);

const TreeNodeComponent = memo(({ data, selected }: NodeProps<TreeNode>) => {
  const stage = data?.stage || 'seed';

  // Seed - brown seed in soil
  if (stage === 'seed') {
    return (
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ position: 'relative', width: 40, height: 50, cursor: 'pointer' }}
      >
        <Handle type="source" position={Position.Top} style={{ background: '#654321', width: 8, height: 8, top: 5 }} />

        {/* Soil mound */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: -10,
          width: 60,
          height: 25,
          background: 'linear-gradient(180deg, #8B4513 0%, #654321 100%)',
          borderRadius: '50% 50% 0 0',
        }} />

        {/* Seed */}
        <motion.div
          animate={selected ? { scale: 1.1 } : { y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 18,
            height: 24,
            background: 'linear-gradient(135deg, #DEB887 0%, #8B4513 100%)',
            borderRadius: '40% 40% 50% 50%',
            border: selected ? '2px solid #FFD700' : 'none',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>
    );
  }

  // Sprout - small green shoot
  if (stage === 'sprout') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ position: 'relative', width: 50, height: 60, cursor: 'pointer' }}
      >
        <Handle type="target" position={Position.Bottom} style={{ background: '#654321', width: 8, height: 8, bottom: 5 }} />
        <Handle type="source" position={Position.Top} style={{ background: '#228B22', width: 6, height: 6, top: 0 }} />

        {/* Stem */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 35 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            width: 6,
            background: 'linear-gradient(180deg, #90EE90 0%, #228B22 100%)',
            borderRadius: 3,
            transform: 'translateX(-50%)',
          }}
        />

        {/* Two small leaves */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{
            position: 'absolute',
            top: 8,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Leaf size={10} rotation={-45} delay={0.4} />
          <div style={{ position: 'absolute', left: 8 }}>
            <Leaf size={10} rotation={45} delay={0.5} />
          </div>
        </motion.div>

        {selected && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: -5,
              border: '2px solid #FFD700',
              borderRadius: 10,
            }}
          />
        )}
      </motion.div>
    );
  }

  // Branch - cluster of leaves
  if (stage === 'branch') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ position: 'relative', width: 60, height: 50, cursor: 'pointer' }}
      >
        <Handle type="target" position={Position.Bottom} style={{ background: '#654321', width: 10, height: 10, bottom: -5 }} />
        <Handle type="source" position={Position.Top} style={{ background: '#228B22', width: 8, height: 8, top: -4 }} />

        {/* Leaf cluster */}
        <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ position: 'absolute', left: -15, top: 5 }}><Leaf size={14} rotation={-30} delay={0.1} /></div>
          <div style={{ position: 'absolute', left: 0, top: -5 }}><Leaf size={16} rotation={0} delay={0.2} /></div>
          <div style={{ position: 'absolute', left: 15, top: 5 }}><Leaf size={14} rotation={30} delay={0.3} /></div>
          <div style={{ position: 'absolute', left: -8, top: 15 }}><Leaf size={12} rotation={-15} delay={0.4} /></div>
          <div style={{ position: 'absolute', left: 8, top: 15 }}><Leaf size={12} rotation={15} delay={0.5} /></div>
        </div>

        {selected && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: -5,
              border: '2px solid #FFD700',
              borderRadius: '50%',
            }}
          />
        )}
      </motion.div>
    );
  }

  // Flower - pink blossom
  if (stage === 'flower') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ position: 'relative', width: 60, height: 60, cursor: 'pointer' }}
      >
        <Handle type="target" position={Position.Bottom} style={{ background: '#654321', width: 10, height: 10, bottom: -5 }} />
        <Handle type="source" position={Position.Top} style={{ background: '#FF69B4', width: 8, height: 8, top: -4 }} />

        {/* Flower */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <Petal key={angle} angle={angle} delay={0.1 + i * 0.1} />
          ))}

          {/* Center */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 16,
              height: 16,
              background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
            }}
          />
        </div>

        {/* Gentle sway animation */}
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        />

        {selected && (
          <motion.div
            animate={{ boxShadow: ['0 0 10px #FFD700', '0 0 20px #FFD700', '0 0 10px #FFD700'] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: -5,
              borderRadius: '50%',
            }}
          />
        )}
      </motion.div>
    );
  }

  // Fruit - red apple
  if (stage === 'fruit') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ position: 'relative', width: 50, height: 55, cursor: 'pointer' }}
      >
        <Handle type="target" position={Position.Bottom} style={{ background: '#654321', width: 10, height: 10, bottom: -5 }} />
        <Handle type="source" position={Position.Top} style={{ background: '#228B22', width: 6, height: 6, top: 0 }} />

        {/* Stem */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 2,
            left: '50%',
            width: 4,
            background: '#654321',
            borderRadius: 2,
            transform: 'translateX(-50%)',
          }}
        />

        {/* Leaf on stem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: '55%',
          }}
        >
          <Leaf size={8} rotation={45} delay={0.3} />
        </motion.div>

        {/* Apple body */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 36,
            height: 38,
            background: 'radial-gradient(circle at 30% 30%, #FF6347 0%, #DC143C 50%, #8B0000 100%)',
            borderRadius: '45% 45% 50% 50%',
            boxShadow: selected
              ? '0 0 15px rgba(255, 215, 0, 0.8), 4px 4px 8px rgba(0,0,0,0.3)'
              : '4px 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          {/* Shine highlight */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '25%',
            height: '20%',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }} />
        </motion.div>

        {/* Gentle swing */}
        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        />
      </motion.div>
    );
  }

  return null;
});

TreeNodeComponent.displayName = 'TreeNode';

export default TreeNodeComponent;
