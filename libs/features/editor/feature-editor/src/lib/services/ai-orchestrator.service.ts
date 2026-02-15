import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { AIService } from '@negocio/shared-components';
import { AIMemoryService } from './ai-memory.service';

@Injectable({
  providedIn: 'root'
})
export class AIOrchestratorService {
  constructor(
    private aiService: AIService,
    private aiMemory: AIMemoryService
  ) {}

  /**
   * Refines and compresses the prompt using a cheaper logic/model 
   * to save tokens and improve master model accuracy.
   */
  refinePrompt(instruction: string): Observable<string> {
    const history = this.aiMemory.getHistory();
    const context = this.aiMemory.getBrainContext();

    // In a real multi-LLM setup, we would call a cheaper model here (e.g., Gemini Flash)
    // For now, we simulate this by constructing a "Refinement" prompt.
    const refinementPrompt = `
      SISTEMA DE PRE-PROCESAMIENTO DE IA:
      Tu tarea es destilar la intención del usuario y su memoria en una instrucción ÚNICA y CONCISA.
      
      CONTEXTO DE MEMORIA:
      ${context}

      INSTRUCCIÓN ORIGINAL DEL USUARIO:
      "${instruction}"

      RESPONDE ÚNICAMENTE con la instrucción refinada en una sola frase, omitiendo paja y manteniendo el foco en el diseño.
    `;

    return this.aiService.sendMessage([refinementPrompt]).pipe(
      map(response => response.text.trim())
    );
  }

  /**
   * Orchestrates the call to the Master Model
   */
  executeDesignAction(instruction: string, componentContext: any): Observable<{ text: string }> {
    return this.refinePrompt(instruction).pipe(
      switchMap(refinedInstruction => {
        console.log('AI Orchestrator - Refined Prompt:', refinedInstruction);
        
        const masterPrompt = `
          SISTEMA MAESTRO DE DISEÑO ANTO STUDIOS:
          Genera el JSON de estilo basado en esta instrucción destilada:
          "${refinedInstruction}"

          CONTEXTO TÉCNICO:
          ${JSON.stringify(componentContext)}

          FORMATO DE SALIDA: JSON estricto con "type", "data" y "explanation".
        `;

        return this.aiService.sendMessage([masterPrompt]);
      })
    );
  }
}
