import { useCallback, useState } from 'react';
import { type Edge } from '@xyflow/react';
import dagre from 'dagre';
import type { TreeNode, TreeNodeData, NodeStage, AppNode, AppEdge } from '../types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 70;
const NODE_HEIGHT = 70;

const getLayoutedElements = (nodes: AppNode[], edges: AppEdge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });

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

const stageOrder: NodeStage[] = ['seed', 'sprout', 'branch', 'flower', 'fruit'];

const getNextStage = (current: NodeStage): NodeStage => {
  const idx = stageOrder.indexOf(current);
  return idx < stageOrder.length - 1 ? stageOrder[idx + 1] : current;
};

const branchNames = [
  'Creative', 'Bold', 'Playful', 'Formal', 'Witty', 'Poetic',
  'Technical', 'Simple', 'Dramatic', 'Mysterious', 'Elegant', 'Quirky',
  'Inspiring', 'Concise', 'Vivid', 'Warm', 'Cool', 'Dynamic'
];

let nodeIdCounter = 1;

export function useTreeGrowth() {
  const [nodes, setNodes] = useState<AppNode[]>([
    {
      id: '0',
      type: 'treeNode',
      position: { x: 0, y: 0 },
      data: { label: 'Seed Prompt', stage: 'seed', energy: 100 },
    } as TreeNode,
  ]);
  const [edges, setEdges] = useState<AppEdge[]>([]);
  const [score, setScore] = useState(0);
  const [sunlight, setSunlight] = useState(100);
  const [water, setWater] = useState(100);

  const applyLayout = useCallback((newNodes: AppNode[], newEdges: AppEdge[]) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const growBranch = useCallback((parentId: string) => {
    if (sunlight < 20 || water < 15) return false;

    const parentNode = nodes.find(n => n.id === parentId);
    if (!parentNode) return false;

    // Random 1-3 branches
    const branchCount = Math.floor(Math.random() * 3) + 1;
    const newNodes: TreeNode[] = [];
    const newEdges: Edge[] = [];

    for (let i = 0; i < branchCount; i++) {
      const newId = String(nodeIdCounter++);
      const randomName = branchNames[Math.floor(Math.random() * branchNames.length)];

      newNodes.push({
        id: newId,
        type: 'treeNode',
        position: { x: 0, y: 0 },
        data: {
          label: randomName,
          stage: 'sprout',
          energy: Math.floor(Math.random() * 40) + 60,
          isNew: true,
        } as TreeNodeData,
      });

      newEdges.push({
        id: `e-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        type: 'animatedEdge',
        data: { isNew: true },
      });
    }

    const updatedNodes = [...nodes, ...newNodes] as AppNode[];
    const updatedEdges = [...edges, ...newEdges] as AppEdge[];

    applyLayout(updatedNodes, updatedEdges);
    setSunlight(s => Math.max(0, s - 20));
    setWater(w => Math.max(0, w - 15));
    setScore(s => s + branchCount * 10);

    return true;
  }, [nodes, edges, sunlight, water, applyLayout]);

  const evolveNode = useCallback((nodeId: string) => {
    if (sunlight < 15 || water < 10) return false;

    setNodes(nds => nds.map(node => {
      if (node.id === nodeId && node.type === 'treeNode') {
        const treeNode = node as TreeNode;
        const currentStage = treeNode.data.stage;
        const nextStage = getNextStage(currentStage);

        if (nextStage !== currentStage) {
          setSunlight(s => Math.max(0, s - 15));
          setWater(w => Math.max(0, w - 10));
          setScore(s => s + (nextStage === 'fruit' ? 50 : 25));

          return {
            ...treeNode,
            data: {
              ...treeNode.data,
              stage: nextStage,
              energy: Math.min(100, treeNode.data.energy + 20),
            },
          } as TreeNode;
        }
      }
      return node;
    }));

    return true;
  }, [sunlight, water]);

  const pruneNode = useCallback((nodeId: string) => {
    if (nodeId === '0') return false; // Can't prune root

    // Find all descendants
    const descendantIds = new Set<string>();
    const findDescendants = (id: string) => {
      edges.forEach(edge => {
        if (edge.source === id) {
          descendantIds.add(edge.target);
          findDescendants(edge.target);
        }
      });
    };
    findDescendants(nodeId);
    descendantIds.add(nodeId);

    const newNodes = nodes.filter(n => !descendantIds.has(n.id));
    const newEdges = edges.filter(e => !descendantIds.has(e.source) && !descendantIds.has(e.target));

    applyLayout(newNodes, newEdges);
    setWater(w => Math.min(100, w + 10));
    setScore(s => s + 5);

    return true;
  }, [nodes, edges, applyLayout]);

  const addResources = useCallback(() => {
    setSunlight(s => Math.min(100, s + 30));
    setWater(w => Math.min(100, w + 30));
  }, []);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    score,
    sunlight,
    water,
    growBranch,
    evolveNode,
    pruneNode,
    addResources,
  };
}
