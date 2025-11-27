import { memo, useEffect, useState, useMemo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import type { TreeNode } from '../types';
import { useTreeStore } from '../store/treeStore';
import { getThemeById, type StageStyle } from '../themes/treeThemes';

// Floating particles with theme colors
const FloatingParticle = ({ delay, color, style }: { delay: number; color: string; style: string }) => {
  const isLeaf = style === 'leaves' || style === 'petals';
  const size = isLeaf ? 8 : 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [-10, -50],
        x: [0, (Math.random() - 0.5) * 40],
        scale: [0, 1, 0.3],
        rotate: isLeaf ? [0, 180, 360] : 0,
      }}
      transition={{
        duration: 2.5 + Math.random(),
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: isLeaf ? '50% 0 50% 50%' : '50%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: 'none',
      }}
    />
  );
};

// Orbiting decoration
const OrbitingElement = ({ radius, duration, color, size = 4 }: { radius: number; duration: number; color: string; size?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
    style={{
      position: 'absolute',
      width: radius * 2,
      height: radius * 2,
      pointerEvents: 'none',
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  </motion.div>
);

// Animation variants based on stage style - returns animation props and transition separately
const getAnimationConfig = (animation: StageStyle['animation']): {
  animate: Record<string, unknown>;
  transition: Record<string, unknown>;
} => {
  switch (animation) {
    case 'pulse':
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'float':
      return {
        animate: { y: [0, -5, 0] },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'spin':
      return {
        animate: { rotate: [0, 360] },
        transition: { duration: 8, repeat: Infinity, ease: 'linear' }
      };
    case 'breathe':
      return {
        animate: { scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'shimmer':
    default:
      return {
        animate: {},
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      };
  }
};

const TreeNodeComponent = memo(({ data, selected }: NodeProps<TreeNode>) => {
  const themeId = useTreeStore(s => s.currentTheme);
  const theme = getThemeById(themeId);
  const stageStyle = theme.stages[data.stage];

  const [prevStage, setPrevStage] = useState(data.stage);
  const [isEvolving, setIsEvolving] = useState(false);

  // Smooth spring for size transitions
  const springSize = useSpring(stageStyle.size, {
    stiffness: 300,
    damping: 30,
  });

  // Detect stage changes for evolution animation
  useEffect(() => {
    if (data.stage !== prevStage) {
      setIsEvolving(true);
      setPrevStage(data.stage);
      const timer = setTimeout(() => setIsEvolving(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data.stage, prevStage]);

  // Update spring when config changes
  useEffect(() => {
    springSize.set(stageStyle.size);
  }, [stageStyle.size, springSize]);

  const currentSize = useTransform(springSize, (s) => s);

  // Memoize particle colors
  const particleColors = useMemo(() =>
    theme.ambient.particleColors,
    [theme.ambient.particleColors]
  );

  // Border style based on theme
  const borderStyle = useMemo(() => {
    switch (stageStyle.borderStyle) {
      case 'dashed':
        return { borderStyle: 'dashed' as const, borderWidth: 2 };
      case 'double':
        return { borderStyle: 'double' as const, borderWidth: 4 };
      case 'glow':
        return { borderStyle: 'solid' as const, borderWidth: 2 };
      default:
        return { borderStyle: 'solid' as const, borderWidth: 3 };
    }
  }, [stageStyle.borderStyle]);

  const animationConfig = getAnimationConfig(stageStyle.animation);

  return (
    <motion.div
      layout
      layoutId={`node-${data.label}-${themeId}`}
      initial={data.isNew ? { scale: 0, opacity: 0, rotate: -180 } : false}
      animate={{
        scale: selected ? 1.15 : isEvolving ? 1.25 : 1,
        opacity: 1,
        rotate: 0,
      }}
      whileHover={{
        scale: 1.12,
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
      {/* Outer glow aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: -15,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${stageStyle.glowColor}40 0%, transparent 70%)`,
          pointerEvents: 'none',
          filter: `blur(${theme.ambient.glowIntensity * 8}px)`,
        }}
      />

      {/* Background with smooth color transition */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 30% 30%, ${stageStyle.secondaryColor}, ${stageStyle.primaryColor})`,
          boxShadow: selected
            ? `0 0 40px ${stageStyle.glowColor}, 0 0 80px ${stageStyle.glowColor}50, inset 0 0 20px ${stageStyle.glowColor}30`
            : `0 0 25px ${stageStyle.glowColor}80, inset 0 0 15px ${stageStyle.glowColor}20`,
          ...animationConfig.animate,
        }}
        transition={animationConfig.transition}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `${borderStyle.borderWidth}px ${borderStyle.borderStyle} ${stageStyle.glowColor}`,
        }}
      />

      {/* Inner shine highlight */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Evolution burst effect */}
      <AnimatePresence>
        {isEvolving && (
          <>
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${stageStyle.glowColor} 0%, transparent 60%)`,
                pointerEvents: 'none',
              }}
            />
            {/* Burst particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 60,
                  opacity: [1, 0],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: stageStyle.glowColor,
                  boxShadow: `0 0 10px ${stageStyle.glowColor}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Orbiting decorations for higher stages */}
      {(data.stage === 'flower' || data.stage === 'fruit') && (
        <>
          <OrbitingElement radius={stageStyle.size * 0.55} duration={6} color={stageStyle.glowColor} size={5} />
          <OrbitingElement radius={stageStyle.size * 0.65} duration={8} color={particleColors[1] || stageStyle.glowColor} size={4} />
        </>
      )}

      {/* Floating particles */}
      {Array.from({ length: Math.min(data.stage === 'fruit' ? 8 : data.stage === 'flower' ? 6 : 4, 8) }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.3}
          color={particleColors[i % particleColors.length]}
          style={theme.ambient.particles}
        />
      ))}

      {/* Pulsing ring animations */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `2px solid ${stageStyle.glowColor}`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 3,
          delay: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `1px solid ${stageStyle.glowColor}`,
          pointerEvents: 'none',
        }}
      />

      {/* Emoji with themed animation */}
      <motion.span
        key={`${data.stage}-${themeId}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: stageStyle.animation === 'spin' ? [0, 360] : 0,
          y: stageStyle.animation === 'float' ? [0, -3, 0] : 0,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 500, damping: 15 },
          rotate: stageStyle.animation === 'spin'
            ? { duration: 8, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 500, damping: 15 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          fontSize: stageStyle.size * 0.55,
          zIndex: 1,
          filter: `drop-shadow(0 2px 6px rgba(0,0,0,0.4)) drop-shadow(0 0 ${theme.ambient.glowIntensity * 10}px ${stageStyle.glowColor})`,
        }}
      >
        {stageStyle.emoji}
      </motion.span>

      {/* Energy bar with theme color */}
      <div style={{
        position: 'absolute',
        bottom: -16,
        width: '100%',
        height: 6,
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
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
            background: `linear-gradient(90deg, ${stageStyle.primaryColor}, ${stageStyle.glowColor}, ${stageStyle.secondaryColor})`,
            borderRadius: 3,
            boxShadow: `0 0 8px ${stageStyle.glowColor}80`,
          }}
        />
      </div>

      {/* Label tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 5, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        style={{
          position: 'absolute',
          top: -30,
          background: 'rgba(0,0,0,0.85)',
          padding: '5px 10px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
          color: '#fff',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: `1px solid ${stageStyle.glowColor}50`,
          boxShadow: `0 0 15px ${stageStyle.glowColor}30`,
        }}
      >
        {data.label}
      </motion.div>

      {/* Connection handles with theme styling */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: `radial-gradient(circle, ${stageStyle.glowColor}, ${stageStyle.primaryColor})`,
          width: 12,
          height: 12,
          border: '2px solid rgba(255,255,255,0.6)',
          boxShadow: `0 0 10px ${stageStyle.glowColor}`,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: `radial-gradient(circle, ${stageStyle.glowColor}, ${stageStyle.primaryColor})`,
          width: 12,
          height: 12,
          border: '2px solid rgba(255,255,255,0.6)',
          boxShadow: `0 0 10px ${stageStyle.glowColor}`,
        }}
      />
    </motion.div>
  );
});

TreeNodeComponent.displayName = 'TreeNode';

export default TreeNodeComponent;
