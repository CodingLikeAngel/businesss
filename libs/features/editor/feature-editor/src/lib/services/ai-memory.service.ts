import { Injectable } from '@angular/core';

export interface UserDesignProfile {
  preferredColors: string[];
  preferredPatterns: string[];
  lastThemes: string[];
  rejectedStyles: string[];
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

  constructor() {}

  /**
   * Saves a new message to the conversation history
   */
  saveMessage(message: ChatMessage): void {
    const history = this.getHistory();
    history.push(message);
    // Keep only last 10 messages to avoid prompt bloat
    const trimmedHistory = history.slice(-10);
    localStorage.setItem(this.MEMORY_KEY, JSON.stringify(trimmedHistory));
  }

  /**
   * Retrieves the conversation history
   */
  getHistory(): ChatMessage[] {
    const stored = localStorage.getItem(this.MEMORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Updates the user's design profile based on a new successful design application
   */
  updateProfileFromStyle(style: any): void {
    const profile = this.getProfile();
    
    if (style.backgroundColor) profile.preferredColors.push(style.backgroundColor);
    if (style.patternType) profile.preferredPatterns.push(style.patternType);
    
    // Deduplicate and keep recent 5
    profile.preferredColors = [...new Set(profile.preferredColors)].slice(-5);
    profile.preferredPatterns = [...new Set(profile.preferredPatterns)].slice(-5);
    
    this.saveProfile(profile);
  }

  /**
   * Records a user "dislike" (e.g., when they undo an AI action)
   */
  recordStyleRejection(style: any): void {
    const profile = this.getProfile();
    const styleString = JSON.stringify(style);
    profile.rejectedStyles.push(styleString);
    profile.rejectedStyles = [...new Set(profile.rejectedStyles)].slice(-5);
    this.saveProfile(profile);
  }

  /**
   * Gets the full context for the AI prompt
   */
  getBrainContext(): string {
    const profile = this.getProfile();
    const history = this.getHistory();
    
    let context = `MEMORIA DEL DISEÑADOR (Cerebro Interno):
      - Colores preferidos: ${profile.preferredColors.join(', ') || 'Ninguno aún'}
      - Patrones usados: ${profile.preferredPatterns.join(', ') || 'Ninguno aún'}
      - Estilos rechazados (EVITAR): ${profile.rejectedStyles.join(' | ')}
    `;

    if (history.length > 0) {
      context += `\nHISTORIAL RECIENTE:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`;
    }

    return context;
  }

  private getProfile(): UserDesignProfile {
    const stored = localStorage.getItem(this.PROFILE_KEY);
    return stored ? JSON.parse(stored) : {
      preferredColors: [],
      preferredPatterns: [],
      lastThemes: [],
      rejectedStyles: [],
      visualIdentitySummary: ''
    };
  }

  private saveProfile(profile: UserDesignProfile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  clearMemory(): void {
    localStorage.removeItem(this.MEMORY_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
  }
}
