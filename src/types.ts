import type { Node, Edge, BuiltInNode } from '@xyflow/react';

export type NodeStage = 'seed' | 'sprout' | 'branch' | 'flower' | 'fruit';

export type TreeNodeData = {
  label: string;
  stage: NodeStage;
  energy: number;
  isNew?: boolean;
  [key: string]: unknown;
};

export type TreeNode = Node<TreeNodeData, 'treeNode'>;

export type AnimatedEdgeData = {
  isNew?: boolean;
  [key: string]: unknown;
};

export type AnimatedEdge = Edge<AnimatedEdgeData, 'animatedEdge'>;

export type AppNode = TreeNode | BuiltInNode;
export type AppEdge = AnimatedEdge | Edge;
