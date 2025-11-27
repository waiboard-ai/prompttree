import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import TreeNodeComponent from './components/TreeNode';
import AnimatedEdgeComponent from './components/AnimatedEdge';
import ThemeSelector from './components/ThemeSelector';
import AmbientBackground from './components/AmbientBackground';
import { useTreeStore, useNodes, useEdges, useResources, useSimulationState } from './store/treeStore';
import { mockGrowthService, type GrowthEvent } from './services/mockGrowthService';
import { getThemeById } from './themes/treeThemes';
import type { AppNode, TreeNode } from './types';

const nodeTypes = { treeNode: TreeNodeComponent };
const edgeTypes = { animatedEdge: AnimatedEdgeComponent };

type GameAction = 'grow' | 'evolve' | 'prune' | null;

// Speed presets in milliseconds
const SPEED_PRESETS = [
  { label: '0.5x', value: 4000 },
  { label: '1x', value: 2000 },
  { label: '2x', value: 1000 },
  { label: '4x', value: 500 },
];

function TreeVisualization() {
  const nodes = useNodes();
  const edges = useEdges();
  const { sunlight, water, score } = useResources();
  const { isAutoGrowing, isPaused } = useSimulationState();
  const currentTheme = useTreeStore(s => s.currentTheme);
  const theme = getThemeById(currentTheme);

  const growBranch = useTreeStore(s => s.growBranch);
  const evolveNode = useTreeStore(s => s.evolveNode);
  const pruneNode = useTreeStore(s => s.pruneNode);
  const addResources = useTreeStore(s => s.addResources);
  const setNodes = useTreeStore(s => s.setNodes);
  const reset = useTreeStore(s => s.reset);

  const [action, setAction] = useState<GameAction>(null);
  const [message, setMessage] = useState<string>('');
  const [events, setEvents] = useState<GrowthEvent[]>([]);
  const [selectedSpeed, setSelectedSpeed] = useState(2000);

  const { fitView } = useReactFlow();
  const fitViewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto fit view when nodes change
  useEffect(() => {
    if (fitViewTimeoutRef.current) {
      clearTimeout(fitViewTimeoutRef.current);
    }
    fitViewTimeoutRef.current = setTimeout(() => {
      fitView({ padding: 0.3, duration: 500 });
    }, 100);
    return () => {
      if (fitViewTimeoutRef.current) {
        clearTimeout(fitViewTimeoutRef.current);
      }
    };
  }, [nodes.length, fitView]);

  // Subscribe to growth events
  useEffect(() => {
    const unsubscribe = mockGrowthService.subscribe((event) => {
      setEvents(prev => [...prev.slice(-4), event]);
      setMessage(event.message);
      setTimeout(() => setMessage(''), 2000);
    });
    return unsubscribe;
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleToggleSimulation = () => {
    if (isAutoGrowing) {
      mockGrowthService.stop();
    } else {
      mockGrowthService.start(selectedSpeed);
    }
  };

  const handleTogglePause = () => {
    mockGrowthService.togglePause();
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    if (isAutoGrowing) {
      mockGrowthService.setSpeed(speed);
    }
  };

  const handleReset = () => {
    mockGrowthService.stop();
    reset();
    setEvents([]);
  };

  const onNodeClick: NodeMouseHandler<AppNode> = useCallback((_event, node) => {
    if (action === 'grow') {
      if (growBranch(node.id)) {
        showMessage('New branches sprouted!');
      } else {
        showMessage('Not enough resources!');
      }
      setAction(null);
    } else if (action === 'evolve') {
      const treeNode = node as TreeNode;
      if (treeNode.data?.stage === 'fruit') {
        showMessage('Already fully evolved!');
      } else if (evolveNode(node.id)) {
        showMessage('Node evolved!');
      } else {
        showMessage('Not enough resources!');
      }
      setAction(null);
    } else if (action === 'prune') {
      if (node.id === '0') {
        showMessage("Can't prune the seed!");
      } else if (pruneNode(node.id)) {
        showMessage('Branch pruned! Recovered some water.');
      }
      setAction(null);
    }
  }, [action, growBranch, evolveNode, pruneNode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Themed ambient background */}
      <AmbientBackground />

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '16px 24px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h1 style={{
            color: theme.branch.glowColor,
            fontSize: 28,
            fontWeight: 700,
            textShadow: `0 0 20px ${theme.branch.glowColor}50`
          }}>
            Promptree
          </h1>
          <ThemeSelector />
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ color: theme.ambient.particleColors[0], fontSize: 14 }}>
            Nodes: {nodes.length}
          </div>
          <div style={{ color: '#fbbf24', fontSize: 20, fontWeight: 600 }}>
            Score: {score}
          </div>
        </div>
      </motion.div>

      {/* Simulation Controls Panel */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          position: 'absolute',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.8)',
          borderRadius: 16,
          padding: '12px 20px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleSimulation}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: isAutoGrowing
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isAutoGrowing
              ? '0 0 20px rgba(239, 68, 68, 0.5)'
              : '0 0 20px rgba(34, 197, 94, 0.5)',
          }}
        >
          {isAutoGrowing ? '⏹' : '▶'}
        </motion.button>

        {/* Pause Button (only when running) */}
        <AnimatePresence>
          {isAutoGrowing && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTogglePause}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: 'none',
                background: isPaused
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                  : 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPaused ? '▶' : '⏸'}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Speed Controls */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginRight: 4 }}>Speed:</span>
          {SPEED_PRESETS.map((preset) => (
            <motion.button
              key={preset.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSpeedChange(preset.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: selectedSpeed === preset.value
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                  : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 12,
                fontWeight: selectedSpeed === preset.value ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Reset
        </motion.button>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div
            animate={{
              scale: isAutoGrowing && !isPaused ? [1, 1.3, 1] : 1,
              opacity: isAutoGrowing ? 1 : 0.5,
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isAutoGrowing
                ? isPaused ? '#fbbf24' : '#22c55e'
                : '#6b7280',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            {isAutoGrowing ? (isPaused ? 'Paused' : 'Growing...') : 'Stopped'}
          </span>
        </div>
      </motion.div>

      {/* Resources Panel */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 16,
          padding: 20,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          minWidth: 180,
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 14, opacity: 0.7 }}>RESOURCES</h3>

        {/* Sunlight */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>☀️</span>
              <span style={{ color: '#fbbf24', fontSize: 14 }}>Sunlight</span>
            </div>
            <span style={{ color: '#fbbf24', fontSize: 12 }}>{Math.round(sunlight)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${sunlight}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                borderRadius: 8,
                boxShadow: '0 0 10px #fbbf2480',
              }}
            />
          </div>
        </div>

        {/* Water */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>💧</span>
              <span style={{ color: '#60a5fa', fontSize: 14 }}>Water</span>
            </div>
            <span style={{ color: '#60a5fa', fontSize: 12 }}>{Math.round(water)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${water}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                borderRadius: 8,
                boxShadow: '0 0 10px #60a5fa80',
              }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addResources}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
          }}
        >
          Gather Resources
        </motion.button>
      </motion.div>

      {/* Actions Panel */}
      <motion.div
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 16,
          padding: 20,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 14, opacity: 0.7 }}>MANUAL ACTIONS</h3>

        {[
          { id: 'grow', emoji: '🌱', label: 'Grow', desc: 'Add branches', color: '#22c55e' },
          { id: 'evolve', emoji: '✨', label: 'Evolve', desc: 'Level up node', color: '#a855f7' },
          { id: 'prune', emoji: '✂️', label: 'Prune', desc: 'Remove branch', color: '#ef4444' },
        ].map((btn) => (
          <motion.button
            key={btn.id}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAction(action === btn.id ? null : btn.id as GameAction)}
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 10,
              background: action === btn.id
                ? `linear-gradient(135deg, ${btn.color}, ${btn.color}aa)`
                : 'rgba(255,255,255,0.1)',
              border: action === btn.id ? `2px solid ${btn.color}` : '2px solid transparent',
              borderRadius: 12,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 24 }}>{btn.emoji}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{btn.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{btn.desc}</div>
            </div>
          </motion.button>
        ))}

        {action && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#fbbf24',
              fontSize: 12,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Click a node to {action}
          </motion.p>
        )}
      </motion.div>

      {/* Event Log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          padding: '12px 16px',
          borderRadius: 10,
          maxWidth: 280,
          maxHeight: 150,
          overflow: 'hidden',
        }}
      >
        <h4 style={{ color: '#4ade80', fontSize: 12, marginBottom: 8, opacity: 0.8 }}>GROWTH LOG</h4>
        <AnimatePresence mode="popLayout">
          {events.slice(-4).map((event, i) => (
            <motion.div
              key={event.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1 - i * 0.2, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 11,
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{event.type === 'sprout' ? '🌱' : event.type === 'evolve' ? '✨' : event.type === 'bloom' ? '🌸' : event.type === 'fruit' ? '🍎' : '💫'}</span>
              {event.message}
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            Press play to start auto-growth...
          </p>
        )}
      </motion.div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              background: 'rgba(0,0,0,0.9)',
              padding: '12px 24px',
              borderRadius: 12,
              color: '#fff',
              fontWeight: 500,
              border: '1px solid rgba(74, 222, 128, 0.5)',
              boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          padding: '12px 16px',
          borderRadius: 10,
          maxWidth: 220,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, lineHeight: 1.5 }}>
          <strong style={{ color: '#4ade80' }}>Auto-Growth Mode:</strong><br />
          Press ▶ to watch the tree grow automatically with smooth animations!<br /><br />
          <strong style={{ color: '#a78bfa' }}>Evolution:</strong> 🌱→🌿→🌳→🌸→🍎
        </p>
      </motion.div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          const currentNodes = useTreeStore.getState().nodes;
          const updatedNodes = [...currentNodes];
          changes.forEach((change) => {
            if (change.type === 'position' && change.position) {
              const nodeIndex = updatedNodes.findIndex((n) => n.id === change.id);
              if (nodeIndex !== -1) {
                updatedNodes[nodeIndex] = {
                  ...updatedNodes[nodeIndex],
                  position: change.position,
                };
              }
            }
          });
          setNodes(updatedNodes);
        }}
        onEdgesChange={() => {}}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Controls
          style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            border: `1px solid ${theme.branch.glowColor}30`,
          }}
        />
        <MiniMap
          nodeStrokeColor={theme.branch.glowColor}
          nodeColor={theme.stages.flower.primaryColor}
          nodeBorderRadius={50}
          maskColor="rgba(0,0,0,0.8)"
          style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            border: `1px solid ${theme.branch.glowColor}30`,
          }}
        />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider for useReactFlow hook
export default function App() {
  return (
    <ReactFlowProvider>
      <TreeVisualization />
    </ReactFlowProvider>
  );
}
