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

@Injectable({
  providedIn: 'root'
})
export class AICopilotService {

  constructor(private aiService: AIService) {}

  /**
   * Generates a style update based on user instructions and current context
   */
  getDesignAdvice(instruction: string, context: { section?: Section, element?: Element }): Observable<AICopilotResponse> {
    const systemPrompt = `
      Eres el AI Design Co-pilot de "Anto Studios", un editor de sitios web premium.
      Tu objetivo es traducir instrucciones de diseño en configuraciones técnicas de estilo (JSON).
      
      Debes responder ÚNICAMENTE con un objeto JSON válido que siga esta estructura:
      {
        "type": "style_update",
        "data": {
           // para secciones: backgroundColor, backgroundAttachment, patternType, patternOpacity, padding, borderRadius
           // para elementos: color, fontSize, fontWeight, backgroundColor, borderRadius, boxShadow, transform
        },
        "explanation": "Una breve explicación de por qué aplicaste estos cambios en español."
      }

      CONTEXTO ACTUAL:
      ${JSON.stringify(context)}

      INSTRUCCIÓN DEL USUARIO:
      "${instruction}"

      REGLAS CRÍTICAS:
      1. Usa valores CSS válidos (px, rem, hex, rgba).
      2. No inventes propiedades que no existen en el sistema.
      3. Mantén la estética Premium/Gaming (vidrio, neón, degradados).
      4. Si el usuario pide un patrón, usa: 'stripes', 'dots' o 'grid'.
    `;

    return this.aiService.sendMessage([systemPrompt]).pipe(
      map(response => {
        try {
          // Extract JSON from Gemini response (sometimes it wraps it in markdown blocks)
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
          };
        }
      })
    );
  }
}
