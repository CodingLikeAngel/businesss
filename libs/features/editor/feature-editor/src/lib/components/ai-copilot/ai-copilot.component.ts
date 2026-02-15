import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AICopilotService, AICopilotResponse } from '../../services/ai-copilot.service';
import { selectSelectedSectionId, selectSelectedElementId } from '../../store/selectors/ui.selectors';
import { selectCurrentPage } from '../../store/selectors/page.selectors';
import { updateSection, updateElement } from '../../store/actions/page.actions';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'lib-ai-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-copilot.component.html',
  styleUrls: ['./ai-copilot.component.scss']
})
export class AICopilotComponent implements OnInit {
  isOpen = false;
  prompt = '';
  isProcessing = false;
  lastExplanation = '';
  
  constructor(
    private store: Store,
    private aiCopilot: AICopilotService
  ) {}

  ngOnInit(): void {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async submitPrompt() {
    if (!this.prompt.trim() || this.isProcessing) return;

    this.isProcessing = true;
    this.lastExplanation = 'Procesando tu instrucción con Gemini...';

    try {
      // Get current context
      const page = await firstValueFrom(this.store.select(selectCurrentPage));
      const sectionId = await firstValueFrom(this.store.select(selectSelectedSectionId));
      const elementId = await firstValueFrom(this.store.select(selectSelectedElementId));

      const selectedSection = page?.sections.find(s => s.id === sectionId);
      const selectedElement = selectedSection?.elements.find(e => e.id === elementId);

      const response = await firstValueFrom(
        this.aiCopilot.getDesignAdvice(this.prompt, { 
          section: selectedSection, 
          element: selectedElement 
        })
      );

      if (response.type === 'style_update' && response.data) {
        if (elementId && sectionId) {
          this.store.dispatch(updateElement({ 
            sectionId, 
            elementId, 
            changes: { styles: response.data } 
          }));
        } else if (sectionId) {
          this.store.dispatch(updateSection({ 
            sectionId, 
            changes: { styles: response.data } 
          }));
        }
        this.lastExplanation = response.explanation;
      }
      
      this.prompt = '';
    } catch (error) {
      console.error('AI Copilot Error:', error);
      this.lastExplanation = 'Hubo un error al conectar con Gemini. Revisa tu conexión.';
    } finally {
      this.isProcessing = false;
    }
  }
}
