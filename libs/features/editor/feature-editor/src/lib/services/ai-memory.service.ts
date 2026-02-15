export interface StyleWeight {
  value: string;
  weight: number; // 0 to 1
  hits: number;
  misses: number;
}

export interface UserDesignProfile {
  styleWeights: { [property: string]: StyleWeight[] };
  visualIdentitySummary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AIMemoryService {
  private readonly MEMORY_KEY = 'anto_ai_memory';
  private readonly PROFILE_KEY = 'anto_design_profile';
  private readonly WEIGHT_DECAY = 0.1; // How much a miss hurts the weight
  private readonly WEIGHT_BOOST = 0.2; // How much a hit helps the weight

  constructor() {}

  /**
   * Updates weights based on a successful style application
   */
  updateProfileFromStyle(style: any): void {
    const profile = this.getProfile();
    
    Object.keys(style).forEach(prop => {
      const val = String(style[prop]);
      if (!profile.styleWeights[prop]) profile.styleWeights[prop] = [];
      
      let entry = profile.styleWeights[prop].find(e => e.value === val);
      if (!entry) {
        entry = { value: val, weight: 0.5, hits: 1, misses: 0 };
        profile.styleWeights[prop].push(entry);
      } else {
        entry.hits++;
        entry.weight = Math.min(1, entry.weight + this.WEIGHT_BOOST);
      }
    });
    
    this.saveProfile(profile);
  }

  /**
   * Penalizes weights when a style is rejected (e.g., via Undo)
   */
  recordStyleRejection(style: any): void {
    const profile = this.getProfile();
    
    Object.keys(style).forEach(prop => {
      const val = String(style[prop]);
      if (profile.styleWeights[prop]) {
        const entry = profile.styleWeights[prop].find(e => e.value === val);
        if (entry) {
          entry.misses++;
          entry.weight = Math.max(0, entry.weight - this.WEIGHT_DECAY);
        }
      }
    });
    
    this.saveProfile(profile);
  }

  /**
   * Gets the full context for the AI prompt, highlighting high-weight preferences
   */
  getBrainContext(): string {
    const profile = this.getProfile();
    const history = this.getHistory();
    
    let preferencesSummary = '';
    Object.keys(profile.styleWeights).forEach(prop => {
      // Get top 2 values for each property with weight > 0.6
      const bestValues = profile.styleWeights[prop]
        .filter(e => e.weight > 0.6)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 2)
        .map(e => `${e.value} (confianza: ${Math.round(e.weight * 100)}%)`);
      
      if (bestValues.length > 0) {
        preferencesSummary += `- ${prop}: ${bestValues.join(', ')}\n`;
      }
    });

    let context = `MEMORIA PONDERADA DEL DISEÑADOR (Cerebro Interno):
      Estas son las preferencias aprendidas del usuario tras analizar sus éxitos y rechazos:
      ${preferencesSummary || 'Aún no hay suficientes datos para establecer pesos claros.'}
    `;

    if (history.length > 0) {
      context += `\nHISTORIAL RECIENTE:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`;
    }

    return context;
  }

  private getProfile(): UserDesignProfile {
    const stored = localStorage.getItem(this.PROFILE_KEY);
    return stored ? JSON.parse(stored) : {
      styleWeights: {},
      visualIdentitySummary: ''
    };
  }

  private saveProfile(profile: UserDesignProfile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  public getHistory(): ChatMessage[] {
    const stored = localStorage.getItem(this.MEMORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  public saveMessage(message: ChatMessage): void {
    const history = this.getHistory();
    history.push(message);
    const trimmedHistory = history.slice(-10);
    localStorage.setItem(this.MEMORY_KEY, JSON.stringify(trimmedHistory));
  }

  clearMemory(): void {
    localStorage.removeItem(this.MEMORY_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    console.log('AI Brain cleared successfully.');
  }
}
