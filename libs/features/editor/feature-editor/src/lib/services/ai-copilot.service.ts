import { Injectable } from '@angular/core';
import { AIService } from '@negocio/shared-components';
import { Observable, map } from 'rxjs';
import { Section, Element } from '../models/editor.model';

export interface AISignals {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  patternType?: string;
  patternOpacity?: number;
  borderRadius?: string;
  boxShadow?: string;
  fontSize?: string;
  spacing?: string;
}

export interface AICopilotResponse {
  type: 'style_update' | 'content_update' | 'layout_suggest';
  data: any;
  explanation: string;
}

import { AIOrchestratorService } from './ai-orchestrator.service';
import { AIMemoryService } from './ai-memory.service';

@Injectable({
  providedIn: 'root'
})
export class AICopilotService {

  constructor(
    private orchestrator: AIOrchestratorService,
    private aiMemory: AIMemoryService
  ) {}

  /**
   * Generates a style update based on user instructions and current context
   * using the Multi-LLM Orchestrator for optimization and cost reduction.
   */
  getDesignAdvice(instruction: string, context: { section?: Section, element?: Element }): Observable<AICopilotResponse> {
    return this.orchestrator.executeDesignAction(instruction, context).pipe(
      map(response => {
        try {
          // Extract JSON from response
          const text = response.candidates[0].content.parts[0].text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as AICopilotResponse;
          }
          throw new Error('Could not find JSON in AI response');
        } catch (e) {
          console.error('Error parsing AI response:', e);
          return {
            type: 'style_update',
            data: {},
            explanation: 'Lo siento, no pude procesar esa instrucción de diseño. Inténtalo de nuevo.'
          } as AICopilotResponse;
        }
      })
    );
  }
}
