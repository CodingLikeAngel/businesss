import { Component, Input, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DoCheck } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FeaturesConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UITitleComponent,
  UICardAnimatedComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Features Section Component
 * Synchronized with UIFeaturesSectionComponent to provide the same visual experience
 * while maintaining visual editing capabilities.
 */
@Component({
  selector: 'lib-editor-features-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-features-section.component.html'
})
export class EditorFeaturesSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @Input() featuresConfig!: FeaturesConfig;
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('featuresElement', { static: true }) featuresElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;
  
  // Dynamic children for granular editing
  @ViewChildren('featureElement') featureElements!: QueryList<ElementRef>;

  ngDoCheck() {
    // Sync logic for array items (features) being edited in isolation
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.id && selected.id.includes('_feature_') && selected.index !== undefined) {
       const items = this.section.content['items'];
       
       if (items && items[selected.index] && items[selected.index] !== selected.content) {
           // Clone array to update store reference
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
    // Initialize items from config if needed
    if (!this.section.content['items']) {
      const initialItems = this.featuresConfig.items || [];
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(initialItems))
        }
      });
    }

    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    
    // Static elements
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
    // Subtitle paragraph
    this.applyElementVisualEditing(this.featuresElement, this.section.id + '_subtitle');

    // Dynamic cards
    this.applyFeaturesEditing();
    this.featureElements.changes.subscribe(() => this.applyFeaturesEditing());
  }

  private applyFeaturesEditing() {
    if (!this.featureElements) return;
    this.featureElements.forEach((ref: ElementRef, index: number) => {
      this.applyElementVisualEditing(
        ref, 
        `${this.section.id}_feature_${index}`, 
        { 
          styling: { 
            selectionOutline: '2px solid #3b82f6', 
            resizeHandles: true,
            hoverEffects: true,
            dimensionLabels: true
          }
        }
      );
    });
  }

  /**
   * Get configuration for the section container
   */
  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section', {
      constraints: {
        containment: 'parent',
        minDistance: { top: 10, right: 10, bottom: 10, left: 10 },
        collisionDetection: false,
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #6366f1',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for individual feature cards
   */
  getFeatureCardConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      enableDrag: true, // Allow reordering/moving visually if container permits
      enableResize: true,
      styling: {
        selectionOutline: '2px solid #3b82f6',
        hoverEffects: true,
        dimensionLabels: true,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: { selectionOutline: '2px solid #10b981', hoverEffects: !this.platformInfo.isMobile, resizeHandles: true, dimensionLabels: true }
    });
  }
  
  getSubtitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: { selectionOutline: '2px solid #f59e0b', hoverEffects: !this.platformInfo.isMobile, resizeHandles: true, dimensionLabels: true }
    });
  }

  /**
   * Handle visual editing events
   */
  handleSectionEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id); }
  handleFeatureCardEvent(event: VisualEditingEvent, index: number): void { this.handleVisualEvent(event, this.section.id + '_feature_' + index); }
  handleTitleEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id + '_title'); }
  handleSubtitleEvent(event: VisualEditingEvent): void { this.handleVisualEvent(event, this.section.id + '_subtitle'); }

  /**
   * Custom event handling for features-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_title') {
      if (['moved', 'resized'].includes(event.type)) this.updateTitleStyles(event.bounds);
    } else if (elementId === this.section.id + '_subtitle') {
      if (['moved', 'resized'].includes(event.type)) this.updateSubtitleStyles(event.bounds);
    } else if (elementId.includes('_feature_')) {
       // Handle individual feature card events
       const parts = elementId.split('_feature_');
       if (parts.length > 1) {
         const index = parseInt(parts[1], 10);
         if (!isNaN(index) && ['moved', 'resized'].includes(event.type)) {
           this.updateFeatureStyles(index, event.bounds);
         }
       }
    }
  }

  private updateTitleStyles(bounds: any): void {
    const currentStyles = this.section.content['titleStyles'] || {};
    this.updateSectionContent({
      titleStyles: {
        ...currentStyles,
        position: 'absolute',
        width: bounds.width + 'px',
        left: bounds.x + 'px',
        top: bounds.y + 'px',
        transform: 'none'
      }
    });
  }

  private updateSubtitleStyles(bounds: any): void {
    const currentStyles = this.section.content['subtitleStyles'] || {};
    this.updateSectionContent({
      subtitleStyles: {
        ...currentStyles,
        position: 'absolute',
        width: bounds.width + 'px',
        left: bounds.x + 'px',
        top: bounds.y + 'px',
        transform: 'none'
      }
    });
  }

  private updateFeatureStyles(index: number, bounds: any): void {
    const items = this.section.content['items'];
    if (!items || !items[index]) return;

    const newItems = [...items];
    const item = { ...newItems[index] };
    
    item.styles = {
      ...(item.styles || {}),
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };
    
    newItems[index] = item;
    
    this.updateSectionContent({ items: newItems });
  }

  private updateSectionContent(contentUpdates: any): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: { ...this.section.content, ...contentUpdates }
    });
  }
}
