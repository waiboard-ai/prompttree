import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTreeStore } from '../store/treeStore';
import { treeThemes, getThemeById } from '../themes/treeThemes';

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = useTreeStore(s => s.currentTheme);
  const setTheme = useTreeStore(s => s.setTheme);
  const theme = getThemeById(currentTheme);

  return (
    <div style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'rgba(0,0,0,0.7)',
          border: `2px solid ${theme.branch.glowColor}`,
          borderRadius: 12,
          padding: '10px 16px',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: `0 0 20px ${theme.branch.glowColor}40`,
        }}
      >
        <span style={{ fontSize: 20 }}>{theme.preview}</span>
        <span>{theme.name}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 8,
              background: 'rgba(0,0,0,0.9)',
              borderRadius: 12,
              overflow: 'hidden',
              minWidth: 220,
              boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px ${theme.branch.glowColor}20`,
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 100,
            }}
          >
            {treeThemes.map((t, index) => (
              <motion.button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  x: 5,
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: currentTheme === t.id ? `${t.branch.glowColor}20` : 'transparent',
                  border: 'none',
                  borderLeft: currentTheme === t.id ? `3px solid ${t.branch.glowColor}` : '3px solid transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <motion.span
                  style={{ fontSize: 24 }}
                  animate={currentTheme === t.id ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5, repeat: currentTheme === t.id ? Infinity : 0, repeatDelay: 2 }}
                >
                  {t.preview}
                </motion.span>
                <div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: currentTheme === t.id ? t.branch.glowColor : '#fff',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: 2,
                  }}>
                    {t.description}
                  </div>
                </div>
                {currentTheme === t.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      marginLeft: 'auto',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: t.branch.glowColor,
                      boxShadow: `0 0 10px ${t.branch.glowColor}`,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
