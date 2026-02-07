import { Component, Input, OnInit, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { SmartContainerComponent, SmartContainerConfig } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorSmartContainerIsolatedModeComponent } from './editor-smart-container-isolated-mode.component';

@Component({
  selector: 'lib-editor-smart-container-section',
  standalone: true,
  imports: [
    CommonModule, 
    SmartContainerComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorSmartContainerIsolatedModeComponent
  ],
  template: `
    <section 
      #sectionElement
      [id]="section.id" 
      class="editor-section relative group min-h-[200px]"
      [class.selected]="isSelected"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="getSectionStyles(section.styles)"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{ section.id }}"
      (visualEvents)="handleSectionEvent($event)"
    >
      <!-- Section Quick Actions -->
      <div
        class="absolute top-0 left-0 right-0 h-10 bg-slate-800/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Generic Smart Container</span>
          <div class="h-3 w-[1px] bg-white/20 mx-1"></div>
          <button (click)="openIsolatedMode($event)" class="bg-indigo-600 text-white text-[9px] font-bold px-3 py-1 rounded-full hover:bg-indigo-500 transition-all uppercase tracking-tighter shadow-xl">
            Configure Container 🛠️
          </button>
        </div>
      </div>
      
      <!-- Main Container Component with Visual Editing -->
      <lib-smart-container 
        #containerElement
        [customID]="section.id + '_container'"
        [config]="containerConfig"
        class="editor-element"
        [class.is-selected]="selectedElementId === section.id + '_container'"
        (click)="selectElement($event, getMergedElement(section.id, section.id + '_container', section.content, 'container'))"
        [enhancedVisualEditable]="getContainerEditConfig()"
        elementId="{{ section.id + '_container' }}"
        sectionId="{{ section.id }}"
        (visualEvents)="handleContainerEvent($event)"
      >
        
        <!-- Placeholder content if empty -->
        <div *ngIf="!section.elements || section.elements.length === 0" class="p-16 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl m-4 bg-slate-900/20">
          <div class="text-3xl mb-3 opacity-30">📦</div>
          <p class="text-xs font-bold uppercase tracking-wider">Empty Smart Container</p>
          <p class="text-[10px] opacity-60 mt-2">Use isolated mode to configure layout or add elements.</p>
        </div>

        <!-- Elements rendering would go here -->
        
      </lib-smart-container>

      <!-- Isolated Mode Overlay -->
      <lib-editor-smart-container-isolated-mode
        *ngIf="showIsolatedMode"
        [config]="isolatedConfig!"
        (closed)="showIsolatedMode = false"
        (applied)="onIsolatedModeApplied($event)">
      </lib-editor-smart-container-isolated-mode>

    </section>
  `,
  styles: [`
    .editor-section.selected {
      outline: 2px solid #6366f1;
    }
    .editor-element.is-selected {
      outline: 2px dashed #10b981;
    }
  `]
})
export class EditorSmartContainerSectionComponent extends EnhancedBaseEditorSectionComponent implements OnInit, AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('containerElement', { static: false }) containerElement?: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;
  
  get isSelected(): boolean {
    return this.section.id === this.selectedSectionId;
  }

  // Computed config property that merges section styles into the smart component config
  get containerConfig(): SmartContainerConfig {
    const fromStyles = this.section.styles || {};
    const fromContent = this.section.content?.['config'] || {};
    
    return {
      ...fromContent,
      width: fromContent.width || fromStyles['width'] || '100%',
      height: fromContent.height || fromStyles['height'] || 'auto',
      backgroundColor: fromContent.backgroundColor || fromStyles['backgroundColor'] || fromStyles['background'],
      padding: fromContent.padding || fromStyles['padding'],
      borderRadius: fromContent.borderRadius || fromStyles['borderRadius'],
      ...fromStyles
    };
  }

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    if (this.containerElement) {
       this.applyElementVisualEditing(this.containerElement, this.section.id + '_container', {
         enableDrag: false,
         enableResize: true
       });
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true
      }
    });
  }

  getContainerEditConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: true,
        resizeHandles: true
      },
      constraints: {
        lockAspectRatio: false,
        minWidth: 100,
        minHeight: 100
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleContainerEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_container');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_container') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateContainerStyles(event.bounds);
      }
    }
  }

  private updateContainerStyles(bounds: any): void {
    const currentConfig = this.section.content?.['config'] || {};
    const newConfig = {
      ...currentConfig,
      width: bounds.width + 'px',
      height: bounds.height + 'px'
    };

    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        config: newConfig
      },
      styles: {
          ...this.section.styles,
          width: newConfig.width,
          height: newConfig.height
      }
    });
    
    this.autoExpandSectionHeight(bounds);
  }

  getSectionStyles(styles: any): any {
    if (!styles) return {};
    const s = { ...styles };
    // Container handles its own background if configured
    return s;
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const currentConfig = this.section.content?.['config'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_container',
      type: 'container',
      content: { 
        ...currentConfig,
        elements: this.section.elements || [] 
      },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: {
        width: parseInt(currentConfig.width) || 400,
        height: parseInt(currentConfig.height) || 300
      }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        config: config.content,
      },
      elements: config.content['elements'] || this.section.elements,
      styles: config.styles
    });
    this.showIsolatedMode = false;
  }
}
