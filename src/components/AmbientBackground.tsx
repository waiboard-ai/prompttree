import { motion } from 'framer-motion';

// Floating cloud component
const Cloud = ({ x, y, scale, duration }: { x: string; y: string; scale: number; duration: number }) => (
  <motion.div
    animate={{ x: ['0%', '100%'] }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale})`,
    }}
  >
    <div style={{
      display: 'flex',
      gap: -10,
    }}>
      <div style={{
        width: 60,
        height: 30,
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '50%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }} />
      <div style={{
        width: 80,
        height: 40,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '50%',
        marginTop: -10,
        marginLeft: -20,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }} />
      <div style={{
        width: 50,
        height: 25,
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '50%',
        marginLeft: -15,
        marginTop: 5,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }} />
    </div>
  </motion.div>
);

export default function AmbientBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Sky gradient - morning/day sky */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 40%, #E0F7FA 70%, #90EE90 85%, #228B22 100%)',
        }}
      />

      {/* Sun with glow */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 60px 30px rgba(255,215,0,0.3)',
            '0 0 80px 40px rgba(255,215,0,0.4)',
            '0 0 60px 30px rgba(255,215,0,0.3)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '8%',
          right: '12%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFF9C4 0%, #FFD700 50%, #FFA500 100%)',
        }}
      />

      {/* Clouds */}
      <Cloud x="-20%" y="5%" scale={0.8} duration={120} />
      <Cloud x="-40%" y="15%" scale={1} duration={150} />
      <Cloud x="-60%" y="8%" scale={0.6} duration={100} />

      {/* Distant hills */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: 0,
          right: 0,
          height: 100,
          background: 'linear-gradient(180deg, #6B8E23 0%, #556B2F 100%)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          transform: 'scaleX(1.5)',
        }}
      />

      {/* Ground / Grass */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '22%',
          background: 'linear-gradient(180deg, #228B22 0%, #006400 50%, #004d00 100%)',
        }}
      />

      {/* Grass blades effect */}
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          left: 0,
          right: 0,
          height: 30,
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 4px,
            #32CD32 4px,
            #32CD32 6px,
            transparent 6px,
            transparent 12px
          )`,
          opacity: 0.6,
          maskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 100%)',
        }}
      />

      {/* Soil patch where tree grows */}
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 40,
          background: 'radial-gradient(ellipse, #8B4513 0%, #654321 60%, transparent 100%)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
