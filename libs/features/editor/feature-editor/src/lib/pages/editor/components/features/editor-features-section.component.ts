import { Component, Input, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, DoCheck, HostListener } from '@angular/core';
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

import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorFeaturesIsolatedModeComponent } from './editor-features-isolated-mode.component';

@Component({
  selector: 'lib-editor-features-section',
  standalone: true,
  imports: [
    CommonModule,
    UITitleComponent,
    UICardAnimatedComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorFeaturesIsolatedModeComponent
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
    // Standard Angular check
  }

  trackByItem(index: number, item: any): string {
    return (item && (item.id || item.title)) || index.toString();
  }

  ngAfterViewInit() {
    // Initialize items from config if needed
    if (!this.section.content['items'] && this.featuresConfig?.items) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(this.featuresConfig.items))
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
      enableDrag: true, 
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

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
      // Standard movements/resizes are handled by BaseEditorFeatureComponent via direct service subscription
  }
  /**
   * ISOLATED MODE SUPPORT
   */
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.key === 'i' || event.key === 'I') && !event.ctrlKey && !event.metaKey) {
      if (this.selectedSectionId === this.section.id || (this.selectedElementId && this.selectedElementId.startsWith(this.section.id))) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          this.openIsolatedMode(event as any);
        }
      }
    }
  }

  openIsolatedMode(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_grid',
      type: 'features',
      content: { 
        ...this.section.content,
        gridCols: this.section.content['gridCols'] || 3,
        gridGap: this.section.content['gridGap'] || 20
      },
      styles: { ...this.section.styles },
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 }
    };
    
    document.body.classList.add('isolated-mode-active');
    this.showIsolatedMode = true;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig) {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        ...config.content
      }
    });
    this.closeIsolatedMode();
  }

  closeIsolatedMode() {
    document.body.classList.remove('isolated-mode-active');
    this.showIsolatedMode = false;
    this.isolatedConfig = undefined;
  }
}
