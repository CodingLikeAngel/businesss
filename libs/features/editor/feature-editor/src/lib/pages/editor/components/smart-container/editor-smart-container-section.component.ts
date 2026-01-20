import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { SmartContainerComponent, SmartContainerConfig } from '@negocio/ui-components';

@Component({
  selector: 'lib-editor-smart-container-section',
  standalone: true,
  imports: [CommonModule, SmartContainerComponent],
  template: `
    <section 
      [id]="section.id" 
      class="editor-section relative group"
      [class.selected]="isSelected"
      (click)="selectSection($event, section)">
      
      <!-- Main Container Component with Visual Editing -->
      <lib-smart-container 
        [customID]="section.id + '_container'"
        [config]="containerConfig"
        [attr.data-visual-editable]="section.id"
        class="visual-editable"
        [style.min-height.px]="200"
        [style.min-width.px]="200">
        
        <!-- Placeholder content if empty -->
        <div *ngIf="!section.elements || section.elements.length === 0" class="p-10 text-center text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
          <p>Smart Container (Empty)</p>
          <p class="text-xs mt-2">Drag elements here or configure properties.</p>
        </div>

        <!-- Render children elements here if we support nesting later -->
        
      </lib-smart-container>

    </section>
  `
})
export class EditorSmartContainerSectionComponent extends EnhancedBaseEditorSectionComponent implements OnInit {
  
  get isSelected(): boolean {
    return this.section.id === this.selectedSectionId;
  }

  // Computed config property that merges section styles into the smart component config
  get containerConfig(): SmartContainerConfig {
    const fromStyles = this.section.styles || {};
    const fromContent = this.section.content?.['config'] || {};
    
    return {
      ...fromContent,
       // Map generic styles to specific config keys if needed, 
       // but SmartContainerConfig uses standard CSS names so we can just spread.
      width: fromStyles['width'],
      height: fromStyles['height'],
      backgroundColor: fromStyles['backgroundColor'] || fromStyles['background'],
      padding: fromStyles['padding'],
      margin: fromStyles['margin'],
      borderRadius: fromStyles['borderRadius'],
      border: fromStyles['border'],
      boxShadow: fromStyles['boxShadow'],
      // ... allow direct mapping
      ...fromStyles
    };
  }

  override ngOnInit() {
    super.ngOnInit();
    // Register this section's container for visual editing
    // The BaseEditorFeature handles general listeners, but we might want specific init here
  }
}
