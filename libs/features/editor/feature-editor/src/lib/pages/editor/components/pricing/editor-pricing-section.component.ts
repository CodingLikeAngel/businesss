import { Component, Input, ElementRef, ViewChild, AfterViewInit, DoCheck, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PricingConfig,
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UITitleComponent } from '@negocio/ui-components';
import {
  UIPricingTableSectionComponent
} from '@negocio/featured-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorPricingIsolatedModeComponent, IsolatedModeConfig } from './editor-pricing-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Enhanced Editor Pricing Section Component
 */
@Component({
  selector: 'lib-editor-pricing-section',
  standalone: true,
  imports: [
    CommonModule,
    UIPricingTableSectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorPricingIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-pricing-section.component.html'
})
export class EditorPricingSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @Input() pricingConfig!: PricingConfig;

  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('pricingElement', { static: true }) pricingElement!: ElementRef;

  ngDoCheck() {
    // Sincronización básica si se edita desde el panel
  }

  ngAfterViewInit() {
    // Initial height check
    const pricingStyles = this.section.content['pricingStyles'] || {};
    if (pricingStyles.top && pricingStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(pricingStyles.left) || 0,
        y: parseInt(pricingStyles.top),
        width: parseInt(pricingStyles.width) || 0,
        height: parseInt(pricingStyles.height)
      });
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getPricingWrapperConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
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
      elementId: this.section.id + '_pricing',
      type: 'pricing',
      content: { 
        ...this.section.content
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

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handlePricingWrapperEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_pricing_wrapper');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_pricing_wrapper') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updatePricingStyles(event.bounds);
      }
    }
  }

  private updatePricingStyles(bounds: any): void {
    const currentStyles = this.section.content['pricingStyles'] || {};
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
          pricingStyles: newStyles,
          customStyles: newStyles
        }
      });

      // Automatically expand section height
      this.autoExpandSectionHeight(bounds);
    }
  }
}
