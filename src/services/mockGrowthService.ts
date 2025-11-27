import { useTreeStore } from '../store/treeStore';

// Growth event types for realistic simulation
export type GrowthEvent = {
  type: 'sprout' | 'evolve' | 'bloom' | 'fruit' | 'wither' | 'boost';
  nodeId?: string;
  message: string;
  timestamp: number;
};

// Simulated growth patterns
const growthPatterns = [
  { weight: 0.35, action: 'grow' as const, message: 'New branch sprouting...' },
  { weight: 0.30, action: 'evolve' as const, message: 'Branch maturing...' },
  { weight: 0.20, action: 'resource' as const, message: 'Gathering nutrients...' },
  { weight: 0.15, action: 'boost' as const, message: 'Growth surge!' },
];

// Weather conditions affect growth
export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'stormy';

const weatherEffects: Record<WeatherCondition, { sunMultiplier: number; waterMultiplier: number }> = {
  sunny: { sunMultiplier: 1.5, waterMultiplier: 0.8 },
  rainy: { sunMultiplier: 0.7, waterMultiplier: 1.5 },
  cloudy: { sunMultiplier: 1.0, waterMultiplier: 1.0 },
  stormy: { sunMultiplier: 0.5, waterMultiplier: 2.0 },
};

class MockGrowthService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private eventListeners: Set<(event: GrowthEvent) => void> = new Set();
  private weather: WeatherCondition = 'sunny';
  private weatherChangeInterval: ReturnType<typeof setInterval> | null = null;

  // Start the growth simulation
  start(intervalMs: number = 2000) {
    if (this.intervalId) this.stop();

    const store = useTreeStore.getState();
    store.startAutoGrowth();
    store.setGrowthSpeed(intervalMs);

    this.intervalId = setInterval(() => {
      this.tick();
    }, intervalMs);

    // Change weather periodically
    this.weatherChangeInterval = setInterval(() => {
      this.changeWeather();
    }, 15000); // Every 15 seconds

    this.emitEvent({
      type: 'sprout',
      message: 'Growth simulation started!',
      timestamp: Date.now(),
    });
  }

  // Stop the simulation
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.weatherChangeInterval) {
      clearInterval(this.weatherChangeInterval);
      this.weatherChangeInterval = null;
    }

    const store = useTreeStore.getState();
    store.stopAutoGrowth();

    this.emitEvent({
      type: 'wither',
      message: 'Growth simulation paused',
      timestamp: Date.now(),
    });
  }

  // Pause/resume
  togglePause() {
    const store = useTreeStore.getState();
    store.togglePause();
  }

  // Change growth speed
  setSpeed(ms: number) {
    const wasRunning = this.intervalId !== null;
    if (wasRunning) {
      this.stop();
      this.start(ms);
    }
    useTreeStore.getState().setGrowthSpeed(ms);
  }

  // Main tick function
  private tick() {
    const store = useTreeStore.getState();

    if (store.isPaused) return;

    // Apply weather effects to resources
    const weatherEffect = weatherEffects[this.weather];
    const sunGain = Math.floor(5 * weatherEffect.sunMultiplier);
    const waterGain = Math.floor(3 * weatherEffect.waterMultiplier);

    // Add resources based on weather
    useTreeStore.setState(s => ({
      sunlight: Math.min(100, s.sunlight + sunGain),
      water: Math.min(100, s.water + waterGain),
    }));

    // Pick weighted random action
    const action = this.pickWeightedAction();

    // Get eligible nodes
    const nodes = store.nodes.filter(n => n.type === 'treeNode');
    if (nodes.length === 0) return;

    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];

    switch (action.action) {
      case 'grow':
        if (store.growBranch(randomNode.id, true)) {
          this.emitEvent({
            type: 'sprout',
            nodeId: randomNode.id,
            message: action.message,
            timestamp: Date.now(),
          });
        }
        break;

      case 'evolve':
        if (store.evolveNode(randomNode.id)) {
          const node = store.nodes.find(n => n.id === randomNode.id);
          const stage = (node as any)?.data?.stage;
          this.emitEvent({
            type: stage === 'flower' ? 'bloom' : stage === 'fruit' ? 'fruit' : 'evolve',
            nodeId: randomNode.id,
            message: action.message,
            timestamp: Date.now(),
          });
        }
        break;

      case 'resource':
        store.addResources();
        this.emitEvent({
          type: 'boost',
          message: action.message,
          timestamp: Date.now(),
        });
        break;

      case 'boost':
        // Boost multiple nodes at once
        const boostCount = Math.min(3, nodes.length);
        for (let i = 0; i < boostCount; i++) {
          const boostNode = nodes[Math.floor(Math.random() * nodes.length)];
          store.evolveNode(boostNode.id);
        }
        this.emitEvent({
          type: 'boost',
          message: action.message,
          timestamp: Date.now(),
        });
        break;
    }
  }

  private pickWeightedAction() {
    const random = Math.random();
    let cumulative = 0;

    for (const pattern of growthPatterns) {
      cumulative += pattern.weight;
      if (random <= cumulative) {
        return pattern;
      }
    }

    return growthPatterns[0];
  }

  private changeWeather() {
    const weathers: WeatherCondition[] = ['sunny', 'rainy', 'cloudy', 'stormy'];
    const newWeather = weathers[Math.floor(Math.random() * weathers.length)];

    if (newWeather !== this.weather) {
      this.weather = newWeather;
      this.emitEvent({
        type: 'boost',
        message: `Weather changed to ${newWeather}!`,
        timestamp: Date.now(),
      });
    }
  }

  getWeather(): WeatherCondition {
    return this.weather;
  }

  // Event system
  subscribe(listener: (event: GrowthEvent) => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  private emitEvent(event: GrowthEvent) {
    this.eventListeners.forEach(listener => listener(event));
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

// Singleton instance
export const mockGrowthService = new MockGrowthService();

// React hook for using the service
export function useGrowthSimulation() {
  return {
    start: (speed?: number) => mockGrowthService.start(speed),
    stop: () => mockGrowthService.stop(),
    togglePause: () => mockGrowthService.togglePause(),
    setSpeed: (ms: number) => mockGrowthService.setSpeed(ms),
    subscribe: (listener: (event: GrowthEvent) => void) => mockGrowthService.subscribe(listener),
    isRunning: () => mockGrowthService.isRunning(),
    getWeather: () => mockGrowthService.getWeather(),
  };
}
