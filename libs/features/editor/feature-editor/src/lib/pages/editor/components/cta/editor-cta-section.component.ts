import { Component, ElementRef, ViewChild, AfterViewInit, DoCheck, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { UITitleComponent } from '@negocio/ui-components';
import { CTASectionComponent as UICTASectionComponent } from '@negocio/featured-components'; // Renamed to avoid conflict with CTASectionComponent in imports array
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorCTAIsolatedModeComponent, IsolatedModeConfig } from './editor-cta-isolated-mode.component';
import { EditorSectionChromeComponent } from '../editor-section-chrome/editor-section-chrome.component';

/**
 * Enhanced Editor CTA Section Component
 * Powered by UI library CTA and standardized editing tools.
 */
@Component({
  selector: 'lib-editor-cta-section',
  standalone: true,
  imports: [
    CommonModule,
    UICTASectionComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorCTAIsolatedModeComponent,
    EditorSectionChromeComponent
  ],
  templateUrl: './editor-cta-section.component.html'
})
export class EditorCtaSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('ctaElement', { static: true }) ctaElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;
  @ViewChild('buttonElement', { static: false }) buttonElement?: ElementRef;

  ngDoCheck() {
    // Sincronización básica si se edita desde el panel lateral
  }

  ngAfterViewInit() {
    // Aplicar edición visual técnica
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.ctaElement, this.section.id + '_cta');
    
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
    if (this.buttonElement) {
      this.applyElementVisualEditing(this.buttonElement, this.section.id + '_button');
    }
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

  getCtaConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        resizeHandles: true,
        dimensionLabels: true
      } as any
    });
  }

  getButtonConfig(): VisualEditingConfig {
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

  handleCtaEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_cta');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  handleButtonEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_button');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (['moved', 'resized'].includes(event.type)) {
      this.updateCtaStyles(event.bounds);
    }
  }

  private updateCtaStyles(bounds: any): void {
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
      elementId: this.section.id + '_cta',
      type: 'cta',
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
}
