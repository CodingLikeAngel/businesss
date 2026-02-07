import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UIAccordion3Component, UIAccordionComponent, UIAccordion1Component, UIAccordion2Component } from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorAccordionIsolatedModeComponent, IsolatedModeConfig } from './editor-accordion-isolated-mode.component';
import { HostListener } from '@angular/core';

@Component({
  selector: 'lib-editor-accordion-3-section',
  standalone: true,
  imports: [
    CommonModule,
    UIAccordion3Component,
    UIAccordionComponent,
    UIAccordion1Component,
    UIAccordion2Component,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorAccordionIsolatedModeComponent
  ],
  template: `
    <div #sectionElement
      class="editor-section cursor-pointer py-4 transition-all group relative"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section.styles"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{section.id}}"
      (visualEvents)="handleSectionEvent($event)">

      <!-- Section Header -->
      <div class="absolute top-0 left-0 right-0 h-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acordeón V3</span>
        </div>
        <button 
          class="flex items-center gap-2 px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-all shadow-sm"
          (click)="openIsolatedMode($event)"
          title="Modo Aislado (I)">
          <span>🎯</span>
          <span>Editar</span>
        </button>
      </div>

      <div #componentElement class="editor-element pt-8"
           [class.is-selected]="selectedElementId === section.id + '_accordion-3'"
           (click)="selectElement($event, getMergedElement(section.id, section.id + '_accordion-3', section.content, 'accordion-3'))"
           [enhancedVisualEditable]="getComponentConfig()"
           elementId="{{section.id + '_accordion-3'}}"
           sectionId="{{section.id}}"
           (visualEvents)="handleComponentEvent($event)">

        <lib-ui-components-accordion-3
          *ngIf="section.content['accordionVariant'] === 'accordion-3' || !section.content['accordionVariant']"
          [variant]="$any(section.content['variant'] || 'secondary')"
          [rounded]="$any(section.content['rounded'] || 'md')"
          [size]="$any(section.content['size'] || 'md')"
          [dark]="section.content['dark'] || false"
          [items]="section.content['items'] || []"
          [customStyles]="section.content['accordionStyles'] || {}"
        ></lib-ui-components-accordion-3>

        <lib-ui-components-accordion
          *ngIf="section.content['accordionVariant'] === 'accordion'"
          [variant]="$any(section.content['variant'] || 'secondary')"
          [items]="section.content['items'] || []"
          [customStyles]="section.content['accordionStyles'] || {}"
        ></lib-ui-components-accordion>

        <lib-ui-components-accordion-1
          *ngIf="section.content['accordionVariant'] === 'accordion-1'"
          [variant]="$any(section.content['variant'] || 'secondary')"
          [rounded]="$any(section.content['rounded'] || 'md')"
          [size]="$any(section.content['size'] || 'md')"
          [dark]="section.content['dark'] || false"
          [items]="section.content['items'] || []"
          [customStyles]="section.content['accordionStyles'] || {}"
        ></lib-ui-components-accordion-1>

        <lib-ui-components-accordion-2
          *ngIf="section.content['accordionVariant'] === 'accordion-2'"
          [variant]="$any(section.content['variant'] || 'secondary')"
          [rounded]="$any(section.content['rounded'] || 'md')"
          [size]="$any(section.content['size'] || 'md')"
          [dark]="section.content['dark'] || false"
          [items]="section.content['items'] || []"
          [customStyles]="section.content['accordionStyles'] || {}"
        ></lib-ui-components-accordion-2>
      </div>
    </div>

    <!-- Isolated Mode Modal -->
    <lib-editor-accordion-isolated-mode
      *ngIf="showIsolatedMode"
      [config]="isolatedConfig!"
      (closed)="closeIsolatedMode()"
      (applied)="applyIsolatedChanges($event)">
    </lib-editor-accordion-isolated-mode>
  `
})
export class EditorAccordion3SectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('componentElement', { static: true }) componentElement!: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig: IsolatedModeConfig | null = null;

  // Layout state for overflow prevention
  sectionHeight = 600;
  containerHeight = 550;

  ngAfterViewInit() {
    this.updateSectionHeight();
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.componentElement, this.section.id + '_accordion-3');
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getComponentConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleComponentEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_accordion-3');
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.key === 'i' || event.key === 'I') && !event.ctrlKey && !event.metaKey) {
      if (this.selectedElementId === this.section.id + '_accordion-3') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          this.openIsolatedMode();
        }
      }
    }
  }

  openIsolatedMode(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const accordionStyles = this.section.content['accordionStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_accordion-3',
      variant: this.section.content['variant'] || 'secondary',
      globalVariant: this.section.content['variant'] || 'secondary',
      content: { ...this.section.content },
      styles: { ...accordionStyles },
      position: { 
        x: parseInt(accordionStyles.left) || 100, 
        y: parseInt(accordionStyles.top) || 100 
      },
      size: { 
        width: parseInt(accordionStyles.width) || 600, 
        height: parseInt(accordionStyles.height) || 450 
      }
    };

    document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  closeIsolatedMode() {
    document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
    this.isolatedConfig = null;
  }

  applyIsolatedChanges(config: IsolatedModeConfig) {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        items: config.content.items,
        variant: config.content.variant,
        accordionVariant: config.content.accordionVariant,
        rounded: config.content.rounded,
        size: config.content.size,
        dark: config.content.dark,
        accordionStyles: config.styles,
        customStyles: config.styles
      }
    });

    this.updateSectionHeight();
    this.closeIsolatedMode();
  }

  private updateSectionHeight() {
    const accordionStyles = this.section.content['accordionStyles'] || {};
    const top = parseInt(accordionStyles.top) || 120;
    const height = parseInt(accordionStyles.height) || 450;
    
    // Calculate required height with safety margin
    const minHeight = top + height + 100;
    
    // Update local state
    if (minHeight > this.sectionHeight) {
      this.sectionHeight = minHeight;
    }
    
    // Sync with section styles in the store if it's significantly different
    const currentStoreHeight = parseInt(this.section.styles['height'] || '0');
    if (Math.abs(currentStoreHeight - this.sectionHeight) > 20) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        styles: {
          ...this.section.styles,
          height: `${this.sectionHeight}px`,
          minHeight: `${this.sectionHeight}px`
        }
      });
    }
  }
}
