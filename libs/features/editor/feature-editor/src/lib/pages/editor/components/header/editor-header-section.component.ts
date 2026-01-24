import { Component, ElementRef, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import {
  UIHeaderComponent
} from '@negocio/ui-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

/**
 * Enhanced Editor Header Section Component
 */
@Component({
  selector: 'lib-editor-header-section',
  standalone: true,
  imports: [
    CommonModule,
    UIHeaderComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-header-section.component.html'
})
export class EditorHeaderSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit, DoCheck {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('headerElement', { static: true }) headerElement!: ElementRef;

  ngDoCheck() {
    const selected = this.uiStateService.selectedElement;
    if (selected && selected.sectionId === this.section.id && selected.isItem && selected.index !== undefined) {
       const items = this.section.content['items'];
       if (items && items[selected.index] && items[selected.index] !== selected.content) {
           const newItems = [...items];
           newItems[selected.index] = selected.content;
           
           this.variantService.updateSectionInCurrentPage(this.section.id, {
             content: {
               ...this.section.content,
               items: newItems,
               navItems: newItems
             }
           });
       }
    }
  }

  ngAfterViewInit() {
    if (!this.section.content['items'] && this.section.content['navItems']) {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        content: {
          ...this.section.content,
          items: JSON.parse(JSON.stringify(this.section.content['navItems']))
        }
      });
    }

    this.applySectionVisualEditing(this.sectionElement, this.section.id);
    this.applyElementVisualEditing(this.headerElement, this.section.id + '_header');
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

  getHeaderConfig(): VisualEditingConfig {
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

  handleHeaderEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_header');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_header' || elementId === this.section.id) {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateHeaderStyles(event.bounds);
      }
    }
  }

  private updateHeaderStyles(bounds: any): void {
    const currentStyles = this.section.styles || {};
    const styles = {
      ...currentStyles,
      width: bounds.width + 'px',
      height: bounds.height + 'px',
      transform: `translate(${bounds.x}px, ${bounds.y}px)`
    };

    if (this.section.id === 'global_header') {
      this.variantService.updateHeaderConfig({
        customStyles: styles
      });
    } else {
      this.variantService.updateSectionInCurrentPage(this.section.id, {
        styles
      });
    }
  }
}
