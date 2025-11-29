import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface Artifact {
  id: string;
  name: string;
  type: 'Protocol' | 'Gateway' | 'Kernel' | 'Forge' | 'Sanctuary';
  description: string;
  testimony: string;
  connections: string[]; // IDs of connected artifacts
  color: string;
}

export interface Node extends SimulationNodeDatum {
  id: string;
  group: number;
  radius: number;
  color: string;
  data: Artifact;
}

export interface Link extends SimulationLinkDatum<Node> {
  value: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'model';
  content: string;
  timestamp: Date;
}