import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import TreeNodeComponent from './components/TreeNode';
import AnimatedEdgeComponent from './components/AnimatedEdge';
import { useTreeGrowth } from './hooks/useTreeGrowth';
import type { AppNode, TreeNode } from './types';

const nodeTypes = { treeNode: TreeNodeComponent };
const edgeTypes = { animatedEdge: AnimatedEdgeComponent };

type GameAction = 'grow' | 'evolve' | 'prune' | null;

export default function App() {
  const {
    nodes,
    edges,
    setNodes,
    score,
    sunlight,
    water,
    growBranch,
    evolveNode,
    pruneNode,
    addResources,
  } = useTreeGrowth();

  const [action, setAction] = useState<GameAction>(null);
  const [message, setMessage] = useState<string>('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
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
        <h1 style={{ color: '#4ade80', fontSize: 28, fontWeight: 700, textShadow: '0 0 20px #4ade8050' }}>
          Promptree
        </h1>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ color: '#fbbf24', fontSize: 20 }}>Score: {score}</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>☀️</span>
            <span style={{ color: '#fbbf24', fontSize: 14 }}>Sunlight</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${sunlight}%` }}
              transition={{ type: 'spring' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                borderRadius: 8,
              }}
            />
          </div>
        </div>

        {/* Water */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>💧</span>
            <span style={{ color: '#60a5fa', fontSize: 14 }}>Water</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${water}%` }}
              transition={{ type: 'spring' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                borderRadius: 8,
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
        <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 14, opacity: 0.7 }}>ACTIONS</h3>

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

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
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
          maxWidth: 250,
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5 }}>
          <strong style={{ color: '#4ade80' }}>How to play:</strong><br />
          1. Select an action (Grow/Evolve/Prune)<br />
          2. Click on a node to apply it<br />
          3. Gather resources when low<br />
          4. Evolve nodes: 🌱→🌿→🌳→🌸→🍎
        </p>
      </motion.div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          setNodes((nds) => {
            const updatedNodes = [...nds];
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
            return updatedNodes;
          });
        }}
        onEdgesChange={() => {}}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={2}
          color="rgba(74, 222, 128, 0.15)"
        />
        <Controls
          style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
        <MiniMap
          nodeStrokeColor="#4ade80"
          nodeColor="#22c55e"
          nodeBorderRadius={50}
          maskColor="rgba(0,0,0,0.8)"
          style={{
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      </ReactFlow>
    </div>
  );
}
