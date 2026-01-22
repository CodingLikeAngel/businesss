import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIAccordionComponent,
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Accordion Section Component
 * Uses EnhancedBaseEditorSectionComponent and EnhancedVisualEditableDirective
 * for standardized visual editing with unified styling application
 */
@Component({
  selector: 'lib-editor-accordion-section',
  standalone: true,
  imports: [
    CommonModule,
    UIAccordionComponent,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-accordion-section.component.html'
})
export class EditorAccordionSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('accordionElement', { static: true }) accordionElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;

  ngAfterViewInit() {
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.accordionElement, this.section.id + '_accordion');
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
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
      },
      interactions: {
        touchEnabled: true,
        multiSelect: false,
        snapToGrid: 0,
        animationDuration: 200,
        hapticFeedback: false
      }
    });
  }

  /**
   * Get configuration for the accordion element
   */
  getAccordionConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Get configuration for the title element
   */
  getTitleConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5,
        animationDuration: 150,
        touchEnabled: this.platformInfo.isTouch,
        multiSelect: true,
        hapticFeedback: true
      },
      constraints: {
        containment: 'parent',
        collisionDetection: true,
        minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
        safeZones: []
      },
      styling: {
        selectionOutline: '2px solid #10b981',
        hoverEffects: !this.platformInfo.isMobile,
        dimensionLabels: !this.platformInfo.isMobile,
        resizeHandles: true
      }
    });
  }

  /**
   * Handle visual editing events
   */
  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleAccordionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_accordion');
  }

  handleTitleEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_title');
  }

  /**
   * Custom event handling for accordion-specific logic
   */
  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_accordion') {
      switch (event.type) {
        case 'selected':
          console.log('Accordion element selected for editing');
          break;
        case 'moved':
        case 'resized':
          this.updateAccordionStyles(event.bounds);
          break;
      }
    } else if (elementId === this.section.id + '_title') {
      switch (event.type) {
        case 'selected':
          console.log('Title element selected for editing');
          break;
        case 'moved':
        case 'resized':
          this.updateTitleStyles(event.bounds);
          break;
      }
    }
  }

  /**
   * Update accordion position/size in section data
   */
  private updateAccordionStyles(bounds: any): void {
    const currentStyles = this.section.content['accordionStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'relative', // or absolute, depending on layout mode
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      // If using translate for movement (visual editor usually does):
      transform: `translate(${bounds.x}px, ${bounds.y}px)`
    };
    
    // Check if we effectively changed anything to avoid loops
    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
       this.variantService.updateSectionInCurrentPage(this.section.id, {
         content: {
           ...this.section.content,
           accordionStyles: newStyles,
           // Keep customStyles in sync if needed, or rely solely on accordionStyles
           customStyles: newStyles
         }
       });
    }
  }

  /**
   * Update title position/size in section data
   */
  private updateTitleStyles(bounds: any): void {
    const currentStyles = this.section.content['titleStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'relative',
      width: bounds.width + 'px',
      // height might be auto for text
      transform: `translate(${bounds.x}px, ${bounds.y}px)`
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
       this.variantService.updateSectionInCurrentPage(this.section.id, {
         content: {
           ...this.section.content,
           titleStyles: newStyles
         }
       });
    }
  }

  /**
   * Filter section styles to prevent color inheritance to child components
   */
  getSectionStyles(styles: any): any {
    if (!styles) return {};
    const filtered = { ...styles };
    // Remove text color properties to prevent affecting child text
    delete filtered['color'];
    delete filtered['--theme-color'];
    return filtered;
  }
}
