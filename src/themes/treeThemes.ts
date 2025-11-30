// Tree visual themes - focus on stunning aesthetics

export interface TreeTheme {
  id: string;
  name: string;
  description: string;
  preview: string; // emoji

  // Background
  background: {
    gradient: string;
    particleColor: string;
    dotColor: string;
  };

  // Node stages
  stages: {
    seed: StageStyle;
    sprout: StageStyle;
    branch: StageStyle;
    flower: StageStyle;
    fruit: StageStyle;
  };

  // Edge/Branch style
  branch: {
    color: string;
    glowColor: string;
    particleColor: string;
    thickness: number;
    style: 'organic' | 'straight' | 'electric' | 'vine';
  };

  // Ambient effects
  ambient: {
    particles: 'leaves' | 'petals' | 'sparks' | 'fireflies' | 'snow' | 'none';
    particleColors: string[];
    glowIntensity: number;
  };
}

export interface StageStyle {
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  size: number;
  borderStyle: 'solid' | 'dashed' | 'double' | 'glow';
  animation: 'pulse' | 'float' | 'spin' | 'breathe' | 'shimmer';
}

// 🌸 Cherry Blossom - Soft pink Japanese aesthetic
export const cherryBlossomTheme: TreeTheme = {
  id: 'cherry-blossom',
  name: 'Cherry Blossom',
  description: 'Elegant Japanese sakura aesthetic',
  preview: '🌸',

  background: {
    gradient: 'linear-gradient(180deg, #1a0a1a 0%, #2d1f3d 50%, #1a1a2e 100%)',
    particleColor: '#ffb7c5',
    dotColor: 'rgba(255, 183, 197, 0.1)',
  },

  stages: {
    seed: {
      emoji: '🫘',
      primaryColor: '#8B4513',
      secondaryColor: '#654321',
      glowColor: '#a0522d',
      size: 45,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    sprout: {
      emoji: '🌱',
      primaryColor: '#90EE90',
      secondaryColor: '#228B22',
      glowColor: '#98fb98',
      size: 50,
      borderStyle: 'solid',
      animation: 'float',
    },
    branch: {
      emoji: '🪵',
      primaryColor: '#8B7355',
      secondaryColor: '#5D4E37',
      glowColor: '#a08060',
      size: 55,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    flower: {
      emoji: '🌸',
      primaryColor: '#FFB7C5',
      secondaryColor: '#FF69B4',
      glowColor: '#ffccd5',
      size: 65,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    fruit: {
      emoji: '🍑',
      primaryColor: '#FFCBA4',
      secondaryColor: '#FF8C69',
      glowColor: '#ffd5b5',
      size: 70,
      borderStyle: 'glow',
      animation: 'pulse',
    },
  },

  branch: {
    color: '#8B7355',
    glowColor: '#FFB7C5',
    particleColor: '#FFB7C5',
    thickness: 4,
    style: 'organic',
  },

  ambient: {
    particles: 'petals',
    particleColors: ['#FFB7C5', '#FFC0CB', '#FFE4E9', '#FF69B4'],
    glowIntensity: 0.6,
  },
};

// 🌲 Enchanted Forest - Mystical green forest
export const enchantedForestTheme: TreeTheme = {
  id: 'enchanted-forest',
  name: 'Enchanted Forest',
  description: 'Mystical woodland magic',
  preview: '🌲',

  background: {
    gradient: 'linear-gradient(180deg, #0a1a0a 0%, #1a2f1a 50%, #0f1f0f 100%)',
    particleColor: '#90EE90',
    dotColor: 'rgba(144, 238, 144, 0.08)',
  },

  stages: {
    seed: {
      emoji: '🌰',
      primaryColor: '#8B4513',
      secondaryColor: '#5D3A1A',
      glowColor: '#90EE90',
      size: 45,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    sprout: {
      emoji: '🌿',
      primaryColor: '#32CD32',
      secondaryColor: '#228B22',
      glowColor: '#7CFC00',
      size: 52,
      borderStyle: 'solid',
      animation: 'float',
    },
    branch: {
      emoji: '🌳',
      primaryColor: '#2E8B57',
      secondaryColor: '#1D5A3A',
      glowColor: '#3CB371',
      size: 60,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    flower: {
      emoji: '✨',
      primaryColor: '#7CFC00',
      secondaryColor: '#32CD32',
      glowColor: '#ADFF2F',
      size: 65,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    fruit: {
      emoji: '💎',
      primaryColor: '#00FF7F',
      secondaryColor: '#00FA9A',
      glowColor: '#7FFFD4',
      size: 70,
      borderStyle: 'glow',
      animation: 'pulse',
    },
  },

  branch: {
    color: '#2E5A1C',
    glowColor: '#7CFC00',
    particleColor: '#90EE90',
    thickness: 5,
    style: 'vine',
  },

  ambient: {
    particles: 'fireflies',
    particleColors: ['#7CFC00', '#ADFF2F', '#00FF7F', '#90EE90'],
    glowIntensity: 0.8,
  },
};

// ⚡ Neon Cyber - Futuristic cyberpunk
export const neonCyberTheme: TreeTheme = {
  id: 'neon-cyber',
  name: 'Neon Cyber',
  description: 'Futuristic digital aesthetic',
  preview: '⚡',

  background: {
    gradient: 'linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0d001a 100%)',
    particleColor: '#00FFFF',
    dotColor: 'rgba(0, 255, 255, 0.1)',
  },

  stages: {
    seed: {
      emoji: '💠',
      primaryColor: '#4B0082',
      secondaryColor: '#2E0854',
      glowColor: '#9400D3',
      size: 45,
      borderStyle: 'glow',
      animation: 'pulse',
    },
    sprout: {
      emoji: '🔷',
      primaryColor: '#00CED1',
      secondaryColor: '#008B8B',
      glowColor: '#00FFFF',
      size: 52,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    branch: {
      emoji: '💜',
      primaryColor: '#9932CC',
      secondaryColor: '#6B238E',
      glowColor: '#DA70D6',
      size: 58,
      borderStyle: 'glow',
      animation: 'pulse',
    },
    flower: {
      emoji: '💫',
      primaryColor: '#FF00FF',
      secondaryColor: '#C71585',
      glowColor: '#FF69B4',
      size: 65,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    fruit: {
      emoji: '🔮',
      primaryColor: '#00FFFF',
      secondaryColor: '#00CED1',
      glowColor: '#E0FFFF',
      size: 72,
      borderStyle: 'glow',
      animation: 'spin',
    },
  },

  branch: {
    color: '#00FFFF',
    glowColor: '#FF00FF',
    particleColor: '#00FFFF',
    thickness: 3,
    style: 'electric',
  },

  ambient: {
    particles: 'sparks',
    particleColors: ['#00FFFF', '#FF00FF', '#9400D3', '#00FF00'],
    glowIntensity: 1.0,
  },
};

// 🍂 Autumn Gold - Warm fall colors
export const autumnGoldTheme: TreeTheme = {
  id: 'autumn-gold',
  name: 'Autumn Gold',
  description: 'Warm harvest season vibes',
  preview: '🍂',

  background: {
    gradient: 'linear-gradient(180deg, #1a0f05 0%, #2d1a0a 50%, #1a1005 100%)',
    particleColor: '#FF8C00',
    dotColor: 'rgba(255, 140, 0, 0.08)',
  },

  stages: {
    seed: {
      emoji: '🌰',
      primaryColor: '#8B4513',
      secondaryColor: '#5D2906',
      glowColor: '#CD853F',
      size: 45,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    sprout: {
      emoji: '🌾',
      primaryColor: '#DAA520',
      secondaryColor: '#B8860B',
      glowColor: '#FFD700',
      size: 52,
      borderStyle: 'solid',
      animation: 'float',
    },
    branch: {
      emoji: '🪵',
      primaryColor: '#A0522D',
      secondaryColor: '#6B3A1F',
      glowColor: '#CD853F',
      size: 58,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    flower: {
      emoji: '🍁',
      primaryColor: '#FF4500',
      secondaryColor: '#DC143C',
      glowColor: '#FF6347',
      size: 65,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    fruit: {
      emoji: '🎃',
      primaryColor: '#FF8C00',
      secondaryColor: '#FF6600',
      glowColor: '#FFA500',
      size: 72,
      borderStyle: 'glow',
      animation: 'pulse',
    },
  },

  branch: {
    color: '#8B4513',
    glowColor: '#FF8C00',
    particleColor: '#FFD700',
    thickness: 5,
    style: 'organic',
  },

  ambient: {
    particles: 'leaves',
    particleColors: ['#FF4500', '#FF8C00', '#FFD700', '#DC143C', '#8B4513'],
    glowIntensity: 0.5,
  },
};

// ❄️ Crystal Winter - Icy magical aesthetic
export const crystalWinterTheme: TreeTheme = {
  id: 'crystal-winter',
  name: 'Crystal Winter',
  description: 'Frozen magical wonderland',
  preview: '❄️',

  background: {
    gradient: 'linear-gradient(180deg, #0a1520 0%, #1a2a40 50%, #0f1a2a 100%)',
    particleColor: '#E0FFFF',
    dotColor: 'rgba(224, 255, 255, 0.1)',
  },

  stages: {
    seed: {
      emoji: '💠',
      primaryColor: '#4682B4',
      secondaryColor: '#2F4F6F',
      glowColor: '#87CEEB',
      size: 45,
      borderStyle: 'solid',
      animation: 'shimmer',
    },
    sprout: {
      emoji: '🧊',
      primaryColor: '#87CEEB',
      secondaryColor: '#4682B4',
      glowColor: '#B0E0E6',
      size: 52,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    branch: {
      emoji: '🌲',
      primaryColor: '#2F5F5F',
      secondaryColor: '#1C3A3A',
      glowColor: '#5F9EA0',
      size: 58,
      borderStyle: 'solid',
      animation: 'breathe',
    },
    flower: {
      emoji: '❄️',
      primaryColor: '#E0FFFF',
      secondaryColor: '#AFEEEE',
      glowColor: '#F0FFFF',
      size: 65,
      borderStyle: 'glow',
      animation: 'spin',
    },
    fruit: {
      emoji: '💎',
      primaryColor: '#B0E0E6',
      secondaryColor: '#87CEEB',
      glowColor: '#E0FFFF',
      size: 72,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
  },

  branch: {
    color: '#4682B4',
    glowColor: '#E0FFFF',
    particleColor: '#B0E0E6',
    thickness: 3,
    style: 'straight',
  },

  ambient: {
    particles: 'snow',
    particleColors: ['#FFFFFF', '#E0FFFF', '#F0F8FF', '#B0E0E6'],
    glowIntensity: 0.7,
  },
};

// 🔥 Inferno - Fiery volcanic theme
export const infernoTheme: TreeTheme = {
  id: 'inferno',
  name: 'Inferno',
  description: 'Volcanic fire and ember',
  preview: '🔥',

  background: {
    gradient: 'linear-gradient(180deg, #0a0000 0%, #1a0500 50%, #0d0200 100%)',
    particleColor: '#FF4500',
    dotColor: 'rgba(255, 69, 0, 0.1)',
  },

  stages: {
    seed: {
      emoji: 'ite�ite',
      primaryColor: '#4a0000',
      secondaryColor: '#2a0000',
      glowColor: '#8B0000',
      size: 45,
      borderStyle: 'glow',
      animation: 'pulse',
    },
    sprout: {
      emoji: '🌋',
      primaryColor: '#8B0000',
      secondaryColor: '#5a0000',
      glowColor: '#DC143C',
      size: 52,
      borderStyle: 'glow',
      animation: 'pulse',
    },
    branch: {
      emoji: '🔥',
      primaryColor: '#FF4500',
      secondaryColor: '#DC143C',
      glowColor: '#FF6347',
      size: 60,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
    flower: {
      emoji: '💥',
      primaryColor: '#FF8C00',
      secondaryColor: '#FF4500',
      glowColor: '#FFA500',
      size: 68,
      borderStyle: 'glow',
      animation: 'pulse',
    },
    fruit: {
      emoji: '⭐',
      primaryColor: '#FFD700',
      secondaryColor: '#FFA500',
      glowColor: '#FFFF00',
      size: 75,
      borderStyle: 'glow',
      animation: 'shimmer',
    },
  },

  branch: {
    color: '#8B0000',
    glowColor: '#FF4500',
    particleColor: '#FF6347',
    thickness: 4,
    style: 'electric',
  },

  ambient: {
    particles: 'sparks',
    particleColors: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#DC143C'],
    glowIntensity: 1.0,
  },
};

// All available themes
export const treeThemes: TreeTheme[] = [
  cherryBlossomTheme,
  enchantedForestTheme,
  neonCyberTheme,
  autumnGoldTheme,
  crystalWinterTheme,
  infernoTheme,
];

export const getThemeById = (id: string): TreeTheme => {
  return treeThemes.find(t => t.id === id) || cherryBlossomTheme;
};
