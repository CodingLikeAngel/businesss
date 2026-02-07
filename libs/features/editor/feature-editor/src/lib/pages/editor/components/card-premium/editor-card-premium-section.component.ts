import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardPremiumComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorCardPremiumIsolatedModeComponent } from './editor-card-premium-isolated-mode.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';

@Component({
  selector: 'lib-editor-card-premium-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardPremiumComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorCardPremiumIsolatedModeComponent
  ],
  template: `
    <div
      #sectionElement
      class="editor-section cursor-pointer transition-all duration-500 group relative min-h-[500px]"
      [class.is-selected]="selectedSectionId === section.id"
      (click)="selectSection($event, section)"
      [applyDynamicStyles]="section.styles"
      [enhancedVisualEditable]="getSectionConfig()"
      sectionId="{{ section.id }}"
      (visualEvents)="handleSectionEvent($event)"
    >
      <!-- Section Quick Actions -->
      <div
        class="absolute top-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Carta Premium</span>
          <div class="h-4 w-[1px] bg-slate-200 mx-2"></div>
          <button (click)="openIsolatedMode($event)" class="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors uppercase tracking-widest shadow-lg shadow-indigo-200">
            Editor Avanzado ⚡
          </button>
        </div>
      </div>

      <div class="container mx-auto px-6 max-w-7xl relative py-24 h-full min-h-[500px] flex items-center justify-center">
        <lib-ui-components-card-premium 
          #cardElement
          [config]="getCardConfigData()"
          [variant]="$any(getVariant(section.id))"
          [customStyles]="section.content['cardStyles'] || {}"
          class="editor-element"
          [class.is-selected]="selectedElementId === section.id + '_card'"
          (click)="selectElement($event, getMergedElement(section.id, section.id + '_card', section.content, 'card-premium'))"
          [enhancedVisualEditable]="getCardConfig()"
          elementId="{{ section.id + '_card' }}"
          sectionId="{{ section.id }}"
          (visualEvents)="handleCardEvent($event)"
          [style.position]="section.content['cardStyles']?.['position'] || 'relative'"
          [style.width]="section.content['cardStyles']?.['width'] || '100%'"
          [style.max-width.px]="400"
          [style.height]="section.content['cardStyles']?.['height']"
          [style.left]="section.content['cardStyles']?.['left']"
          [style.top]="section.content['cardStyles']?.['top']"
        >
        </lib-ui-components-card-premium>
      </div>

      <!-- Isolated Mode Overlay -->
      <lib-editor-card-premium-isolated-mode
        *ngIf="showIsolatedMode"
        [config]="isolatedConfig!"
        (closed)="showIsolatedMode = false"
        (applied)="onIsolatedModeApplied($event)">
      </lib-editor-card-premium-isolated-mode>
    </div>
  `
})
export class EditorCardPremiumSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('cardElement', { static: false }) cardElement?: ElementRef;

  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    if (this.cardElement) {
      this.applyElementVisualEditing(this.cardElement, this.section.id + '_card');
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

  getCardConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true
      },
      constraints: {
        lockAspectRatio: false
      }
    });
  }

  getCardConfigData() {
    return {
      title: this.section.content['title'] || 'Premium Title',
      description: this.section.content['description'] || 'Premium description text.',
      icon: this.section.content['icon'] || 'heroStar',
      image: this.section.content['image'] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
      price: this.section.content['price'] || '',
      discount: this.section.content['discount'] || '',
      tooltip: this.section.content['tooltip'] || ''
    };
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleCardEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_card');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_card') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateCardStyles(event.bounds);
      }
    }
  }

  private updateCardStyles(bounds: any): void {
    const currentStyles = this.section.content['cardStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px'
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          cardStyles: newStyles,
          customStyles: newStyles
        }
      });
      this.autoExpandSectionHeight(bounds);
    }
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const cardStyles = this.section.content['cardStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_card',
      type: 'card-premium',
      content: { 
        ...this.getCardConfigData(), 
        variant: this.getVariant(this.section.id),
        globalVariant: this.globalVariant
      },
      styles: { ...cardStyles },
      position: {
        x: parseInt(cardStyles.left) || 0,
        y: parseInt(cardStyles.top) || 0
      },
      size: {
        width: parseInt(cardStyles.width) || 400,
        height: parseInt(cardStyles.height) || 500
      }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        ...config.content,
        cardStyles: config.styles,
        customStyles: config.styles
      }
    });
    
    if (config.content['variant']) {
        this.variantService.setComponentVariant(this.section.id, config.content['variant']);
    }

    this.showIsolatedMode = false;
  }
}
