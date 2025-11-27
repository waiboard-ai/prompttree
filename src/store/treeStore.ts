import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import type { TreeNode, TreeNodeData, NodeStage, AppNode, AppEdge } from '../types';
import type { Edge } from '@xyflow/react';
import dagre from 'dagre';

// Layout constants
const NODE_WIDTH = 70;
const NODE_HEIGHT = 70;

// Stage progression
const stageOrder: NodeStage[] = ['seed', 'sprout', 'branch', 'flower', 'fruit'];

const getNextStage = (current: NodeStage): NodeStage => {
  const idx = stageOrder.indexOf(current);
  return idx < stageOrder.length - 1 ? stageOrder[idx + 1] : current;
};

// Branch name variations for prompts
const branchNames = [
  'Creative', 'Bold', 'Playful', 'Formal', 'Witty', 'Poetic',
  'Technical', 'Simple', 'Dramatic', 'Mysterious', 'Elegant', 'Quirky',
  'Inspiring', 'Concise', 'Vivid', 'Warm', 'Cool', 'Dynamic',
  'Minimal', 'Expressive', 'Precise', 'Abstract', 'Narrative', 'Direct'
];

// Dagre layout helper
const getLayoutedElements = (nodes: AppNode[], edges: AppEdge[]): { nodes: AppNode[]; edges: AppEdge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'BT', ranksep: 80, nodesep: 60 }); // BT = bottom-to-top for real tree growth

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes as AppNode[], edges };
};

// Store state interface
interface TreeState {
  // Tree data
  nodes: AppNode[];
  edges: AppEdge[];

  // Resources
  sunlight: number;
  water: number;
  score: number;

  // Simulation state
  isAutoGrowing: boolean;
  growthSpeed: number; // ms between growth ticks
  isPaused: boolean;

  // Node ID counter
  nodeIdCounter: number;

  // Theme
  currentTheme: string;

  // Pending animations queue
  pendingAnimations: Array<{
    type: 'grow' | 'evolve' | 'prune';
    nodeId: string;
    timestamp: number;
  }>;

  // Actions
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;

  // Growth actions
  growBranch: (parentId: string, animated?: boolean) => boolean;
  evolveNode: (nodeId: string) => boolean;
  pruneNode: (nodeId: string) => boolean;

  // Resource actions
  addResources: () => void;
  consumeResources: (sun: number, water: number) => boolean;

  // Simulation controls
  startAutoGrowth: () => void;
  stopAutoGrowth: () => void;
  togglePause: () => void;
  setGrowthSpeed: (speed: number) => void;

  // Theme
  setTheme: (themeId: string) => void;

  // Auto-growth tick
  autoGrowthTick: () => void;

  // Reset
  reset: () => void;
}

// Initial state
const createInitialNode = (): TreeNode => ({
  id: '0',
  type: 'treeNode',
  position: { x: 0, y: 0 },
  data: {
    label: 'Seed Prompt',
    stage: 'seed',
    energy: 100,
    isNew: false,
  } as TreeNodeData,
});

export const useTreeStore = create<TreeState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    nodes: [createInitialNode()],
    edges: [],
    sunlight: 100,
    water: 100,
    score: 0,
    isAutoGrowing: false,
    growthSpeed: 2000, // 2 seconds between ticks
    isPaused: false,
    nodeIdCounter: 1,
    currentTheme: 'cherry-blossom',
    pendingAnimations: [],

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    growBranch: (parentId, animated = true) => {
      const state = get();

      if (state.sunlight < 20 || state.water < 15) return false;

      const parentNode = state.nodes.find(n => n.id === parentId);
      if (!parentNode) return false;

      // Random 1-3 branches
      const branchCount = Math.floor(Math.random() * 3) + 1;
      const newNodes: TreeNode[] = [];
      const newEdges: Edge[] = [];
      let newIdCounter = state.nodeIdCounter;

      for (let i = 0; i < branchCount; i++) {
        const newId = String(newIdCounter++);
        const randomName = branchNames[Math.floor(Math.random() * branchNames.length)];
        const randomEnergy = Math.floor(Math.random() * 40) + 60;

        newNodes.push({
          id: newId,
          type: 'treeNode',
          position: { x: 0, y: 0 },
          data: {
            label: randomName,
            stage: 'sprout',
            energy: randomEnergy,
            isNew: animated,
          } as TreeNodeData,
        });

        newEdges.push({
          id: `e-${parentId}-${newId}`,
          source: parentId,
          target: newId,
          type: 'animatedEdge',
          data: { isNew: animated },
        });
      }

      const updatedNodes = [...state.nodes, ...newNodes] as AppNode[];
      const updatedEdges = [...state.edges, ...newEdges] as AppEdge[];
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);

      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        nodeIdCounter: newIdCounter,
        sunlight: Math.max(0, state.sunlight - 20),
        water: Math.max(0, state.water - 15),
        score: state.score + branchCount * 10,
        pendingAnimations: animated
          ? [...state.pendingAnimations, { type: 'grow', nodeId: parentId, timestamp: Date.now() }]
          : state.pendingAnimations,
      });

      return true;
    },

    evolveNode: (nodeId) => {
      const state = get();

      if (state.sunlight < 15 || state.water < 10) return false;

      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) return false;

      const node = state.nodes[nodeIndex] as TreeNode;
      if (node.type !== 'treeNode') return false;

      const currentStage = node.data.stage;
      const nextStage = getNextStage(currentStage);

      if (nextStage === currentStage) return false; // Already at max

      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = {
        ...node,
        data: {
          ...node.data,
          stage: nextStage,
          energy: Math.min(100, node.data.energy + 20),
        },
      } as TreeNode;

      set({
        nodes: updatedNodes,
        sunlight: Math.max(0, state.sunlight - 15),
        water: Math.max(0, state.water - 10),
        score: state.score + (nextStage === 'fruit' ? 50 : 25),
        pendingAnimations: [...state.pendingAnimations, { type: 'evolve', nodeId, timestamp: Date.now() }],
      });

      return true;
    },

    pruneNode: (nodeId) => {
      const state = get();

      if (nodeId === '0') return false; // Can't prune root

      // Find all descendants
      const descendantIds = new Set<string>();
      const findDescendants = (id: string) => {
        state.edges.forEach(edge => {
          if (edge.source === id) {
            descendantIds.add(edge.target);
            findDescendants(edge.target);
          }
        });
      };
      findDescendants(nodeId);
      descendantIds.add(nodeId);

      const newNodes = state.nodes.filter(n => !descendantIds.has(n.id));
      const newEdges = state.edges.filter(e => !descendantIds.has(e.source) && !descendantIds.has(e.target));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);

      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        water: Math.min(100, state.water + 10),
        score: state.score + 5,
      });

      return true;
    },

    addResources: () => {
      set(state => ({
        sunlight: Math.min(100, state.sunlight + 30),
        water: Math.min(100, state.water + 30),
      }));
    },

    consumeResources: (sun, water) => {
      const state = get();
      if (state.sunlight < sun || state.water < water) return false;

      set({
        sunlight: state.sunlight - sun,
        water: state.water - water,
      });
      return true;
    },

    startAutoGrowth: () => {
      set({ isAutoGrowing: true, isPaused: false });
    },

    stopAutoGrowth: () => {
      set({ isAutoGrowing: false });
    },

    togglePause: () => {
      set(state => ({ isPaused: !state.isPaused }));
    },

    setGrowthSpeed: (speed) => {
      set({ growthSpeed: speed });
    },

    setTheme: (themeId) => {
      set({ currentTheme: themeId });
    },

    autoGrowthTick: () => {
      const state = get();

      if (!state.isAutoGrowing || state.isPaused) return;

      // Regenerate some resources naturally
      set(s => ({
        sunlight: Math.min(100, s.sunlight + 5),
        water: Math.min(100, s.water + 3),
      }));

      // Get eligible nodes (not fully evolved)
      const eligibleNodes = state.nodes.filter(n => {
        if (n.type !== 'treeNode') return false;
        const treeNode = n as TreeNode;
        return treeNode.data.stage !== 'fruit';
      });

      if (eligibleNodes.length === 0) return;

      // Random action: 60% grow, 40% evolve
      const action = Math.random() < 0.6 ? 'grow' : 'evolve';
      const targetNode = eligibleNodes[Math.floor(Math.random() * eligibleNodes.length)];

      if (action === 'grow') {
        get().growBranch(targetNode.id, true);
      } else {
        get().evolveNode(targetNode.id);
      }
    },

    reset: () => {
      set(state => ({
        nodes: [createInitialNode()],
        edges: [],
        sunlight: 100,
        water: 100,
        score: 0,
        isAutoGrowing: false,
        isPaused: false,
        nodeIdCounter: 1,
        currentTheme: state.currentTheme, // preserve theme on reset
        pendingAnimations: [],
      }));
    },
  }))
);

// Selector hooks for optimized re-renders
export const useNodes = () => useTreeStore(state => state.nodes);
export const useEdges = () => useTreeStore(state => state.edges);
export const useResources = () => useTreeStore(
  useShallow(state => ({
    sunlight: state.sunlight,
    water: state.water,
    score: state.score
  }))
);
export const useSimulationState = () => useTreeStore(
  useShallow(state => ({
    isAutoGrowing: state.isAutoGrowing,
    isPaused: state.isPaused,
    growthSpeed: state.growthSpeed,
  }))
);
