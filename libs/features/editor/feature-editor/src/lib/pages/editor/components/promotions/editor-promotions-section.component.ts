import { Component, Input, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PromotionsConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  PromotionsSectionComponent
} from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Promotions Section Component
 * Standardized for granular store sync and visual editing.
 */
@Component({
  selector: 'lib-editor-promotions-section',
  standalone: true,
  imports: [
    CommonModule,
    PromotionsSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-promotions-section.component.html'
})
export class EditorPromotionsSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @Input() promotionsConfig!: PromotionsConfig;

  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('promotionsElement', { static: true }) promotionsElement!: ElementRef;

  ngDoCheck() {
    // Sync items if edited via side panel
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.isItem && selected.index !== undefined) {
       const items = this.section.content['items'];
       if (items && items[selected.index] && items[selected.index] !== selected.content) {
           const newItems = [...items];
           newItems[selected.index] = selected.content;
           
           this.variantService.updateSectionInCurrentPage(this.section.id, {
             content: {
               ...this.section.content,
               items: newItems
             }
           });
       }
    }
  }

  ngAfterViewInit() {
    // Initialize items from config if store is empty
    if (!this.section.content['items'] && this.promotionsConfig?.premiumCards) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(this.promotionsConfig.premiumCards))
        }
      });
    }

    // Apply basic visual editing
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.promotionsElement, this.section.id + '_promotions_wrapper');
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

  getPromotionsWrapperConfig(): VisualEditingConfig {
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

  handlePromotionsWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_promotions_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id || elementId === this.section.id + '_promotions_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updatePromotionsStyles(event.bounds);
      }
    }
  }

  private updatePromotionsStyles(bounds: any): void {
    const currentStyles = this.section.styles || {};
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      styles: {
        ...currentStyles,
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        transform: `translate(${bounds.x}px, ${bounds.y}px)`
      }
    });
  }
}
