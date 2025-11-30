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
import AmbientBackground from './components/AmbientBackground';
import { useTreeStore, useNodes, useEdges, useResources, useSimulationState } from './store/treeStore';
import { mockGrowthService, type GrowthEvent } from './services/mockGrowthService';
import type { AppNode, TreeNode } from './types';

const nodeTypes = { treeNode: TreeNodeComponent };
const edgeTypes = { animatedEdge: AnimatedEdgeComponent };

type GameAction = 'grow' | 'evolve' | 'prune' | null;

// Speed presets
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
        showMessage('New branch sprouted!');
      } else {
        showMessage('Not enough resources!');
      }
      setAction(null);
    } else if (action === 'evolve') {
      const treeNode = node as TreeNode;
      if (treeNode.data?.stage === 'fruit') {
        showMessage('Already fully grown!');
      } else if (evolveNode(node.id)) {
        showMessage('Branch evolved!');
      } else {
        showMessage('Not enough resources!');
      }
      setAction(null);
    } else if (action === 'prune') {
      if (node.id === '0') {
        showMessage("Can't prune the seed!");
      } else if (pruneNode(node.id)) {
        showMessage('Branch pruned!');
      }
      setAction(null);
    }
  }, [action, growBranch, evolveNode, pruneNode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
          padding: '12px 24px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#228B22', fontSize: 24, fontWeight: 700 }}>
          Promptree
        </h1>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: 14 }}>Branches: {nodes.length}</span>
          <span style={{ color: '#FFD700', fontSize: 18, fontWeight: 600 }}>Score: {score}</span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.75)',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleSimulation}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: isAutoGrowing ? '#DC143C' : '#228B22',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          {isAutoGrowing ? '⏹' : '▶'}
        </motion.button>

        {isAutoGrowing && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleTogglePause}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: isPaused ? '#FFD700' : 'rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </motion.button>
        )}

        <div style={{ display: 'flex', gap: 4 }}>
          {SPEED_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleSpeedChange(preset.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: 'none',
                background: selectedSpeed === preset.value ? '#228B22' : 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent',
            color: '#fff',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isAutoGrowing ? (isPaused ? '#FFD700' : '#32CD32') : '#666',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
            {isAutoGrowing ? (isPaused ? 'Paused' : 'Growing') : 'Stopped'}
          </span>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 12,
          padding: 16,
          minWidth: 160,
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: 12, fontSize: 13, opacity: 0.7 }}>RESOURCES</h3>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#FFD700', fontSize: 13 }}>☀️ Sun</span>
            <span style={{ color: '#FFD700', fontSize: 11 }}>{Math.round(sunlight)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 8 }}>
            <motion.div
              animate={{ width: `${sunlight}%` }}
              style={{ height: '100%', background: '#FFD700', borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#60a5fa', fontSize: 13 }}>💧 Water</span>
            <span style={{ color: '#60a5fa', fontSize: 11 }}>{Math.round(water)}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 8 }}>
            <motion.div
              animate={{ width: `${water}%` }}
              style={{ height: '100%', background: '#60a5fa', borderRadius: 6 }}
            />
          </div>
        </div>

        <button
          onClick={addResources}
          style={{
            width: '100%',
            padding: '8px',
            background: '#228B22',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Gather
        </button>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: 12, fontSize: 13, opacity: 0.7 }}>ACTIONS</h3>

        {[
          { id: 'grow', emoji: '🌱', label: 'Grow', color: '#228B22' },
          { id: 'evolve', emoji: '✨', label: 'Evolve', color: '#a855f7' },
          { id: 'prune', emoji: '✂️', label: 'Prune', color: '#DC143C' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setAction(action === btn.id ? null : btn.id as GameAction)}
            style={{
              width: '100%',
              padding: '10px 14px',
              marginBottom: 8,
              background: action === btn.id ? btn.color : 'rgba(255,255,255,0.1)',
              border: action === btn.id ? `2px solid ${btn.color}` : '2px solid transparent',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
            }}
          >
            <span style={{ fontSize: 20 }}>{btn.emoji}</span>
            {btn.label}
          </button>
        ))}

        {action && (
          <p style={{ color: '#FFD700', fontSize: 11, textAlign: 'center', marginTop: 4 }}>
            Click a node to {action}
          </p>
        )}
      </motion.div>

      {/* Growth Log */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 14px',
          borderRadius: 8,
          maxWidth: 240,
        }}
      >
        <h4 style={{ color: '#228B22', fontSize: 11, marginBottom: 6 }}>GROWTH LOG</h4>
        <AnimatePresence mode="popLayout">
          {events.slice(-3).map((event, i) => (
            <motion.div
              key={event.timestamp}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 - i * 0.25, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 2 }}
            >
              {event.type === 'sprout' ? '🌱' : event.type === 'evolve' ? '✨' : event.type === 'bloom' ? '🌸' : '🍎'} {event.message}
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Press play to grow...</p>
        )}
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              padding: '10px 20px',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evolution Guide */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          zIndex: 10,
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 14px',
          borderRadius: 8,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, lineHeight: 1.4 }}>
          <strong style={{ color: '#228B22' }}>Growth:</strong> 🌰 → 🌱 → 🌿 → 🌸 → 🍎
        </p>
      </div>

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
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
        <MiniMap
          nodeStrokeColor="#228B22"
          nodeColor="#32CD32"
          nodeBorderRadius={50}
          maskColor="rgba(0,0,0,0.7)"
          style={{
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 6,
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <TreeVisualization />
    </ReactFlowProvider>
  );
}
