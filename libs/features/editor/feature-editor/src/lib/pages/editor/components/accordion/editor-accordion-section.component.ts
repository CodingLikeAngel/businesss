import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIAccordionComponent,
  UIAccordion1Component,
  UIAccordion2Component,
  UIAccordion3Component,
  UITitleComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { IsolatedModeConfig } from '../enhanced-visual-editing.interfaces';
import { EditorAccordionIsolatedModeComponent } from './editor-accordion-isolated-mode.component';
import { HostListener } from '@angular/core';

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
    FormsModule,
    UIAccordionComponent,
    UIAccordion1Component,
    UIAccordion2Component,
    UIAccordion3Component,
    UITitleComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorAccordionIsolatedModeComponent
  ],
  templateUrl: './editor-accordion-section.component.html'
})
export class EditorAccordionSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('accordionElement', { static: true }) accordionElement!: ElementRef;
  @ViewChild('titleElement', { static: false }) titleElement?: ElementRef;
  @ViewChild('descElement', { static: false }) descElement?: ElementRef;

  /** Items for the accordion */
  @Input() items: { title: string; content: string }[] = [];

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig: IsolatedModeConfig | null = null;

  ngAfterViewInit() {
    // Initialize items from section content if not provided via input
    if (!this.section.content['items']) {
      this.section.content['items'] = this.items.length > 0 ? this.items : [
        { title: 'Item 1', content: 'Contenido del item 1' },
        { title: 'Item 2', content: 'Contenido del item 2' }
      ];
    }
    
    // Initial height check
    const accordionStyles = this.section.content['accordionStyles'] || {};
    if (accordionStyles.top && accordionStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(accordionStyles.left) || 0,
        y: parseInt(accordionStyles.top),
        width: parseInt(accordionStyles.width) || 0,
        height: parseInt(accordionStyles.height)
      });
    }
    
    // Apply standardized visual editing to elements
    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.accordionElement, this.section.id + '_accordion');
    if (this.titleElement) {
      this.applyElementVisualEditing(this.titleElement, this.section.id + '_title');
    }
    if (this.descElement) {
      this.applyElementVisualEditing(this.descElement, this.section.id + '_desc');
    }
  }

  // ...

  /**
   * Get configuration for the description element
   */
  getDescConfig(): VisualEditingConfig {
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

  handleDescEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_desc');
  }

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
    } else if (elementId === this.section.id + '_desc') {
      switch (event.type) {
        case 'moved':
        case 'resized':
          this.updateDescStyles(event.bounds);
          break;
      }
    }
  }

  private updateDescStyles(bounds: any): void {
    const currentStyles = this.section.content['descStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
       this.variantService.updateSectionInCurrentPage(this.section.id, {
         content: {
           ...this.section.content,
           descStyles: newStyles
         }
       });
    }
  }

  // HANDLERS FOR VISUAL EVENTS
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
  // End of duplications


  /**
   * Update accordion position/size in section data
   */
  private updateAccordionStyles(bounds: any): void {
    const currentStyles = this.section.content['accordionStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none' // Reset transform to prevent double offsetting
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

       // Automatically expand section height to accommodate new position/size
       this.autoExpandSectionHeight(bounds);
    }
  }

  /**
   * Update title position/size in section data
   */
  private updateTitleStyles(bounds: any): void {
    const currentStyles = this.section.content['titleStyles'] || {};
    const newStyles = {
      ...currentStyles,
      position: 'absolute',
      width: bounds.width + 'px',
      // height might be auto for text, but if resized we use it
      left: bounds.x + 'px',
      top: bounds.y + 'px',
      transform: 'none'
    };

    if (JSON.stringify(currentStyles) !== JSON.stringify(newStyles)) {
       this.variantService.updateSectionInCurrentPage(this.section.id, {
         content: {
           ...this.section.content,
           titleStyles: newStyles
         }
       });

       this.autoExpandSectionHeight(bounds);
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Press 'I' to open isolated mode if accordion is selected
    if ((event.key === 'i' || event.key === 'I') && !event.ctrlKey && !event.metaKey) {
      if (this.selectedElementId === this.section.id + '_accordion') {
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
      elementId: this.section.id + '_accordion',
      type: 'accordion',
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

    this.closeIsolatedMode();
  }

}
