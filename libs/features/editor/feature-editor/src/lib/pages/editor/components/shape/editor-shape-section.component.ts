import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIShapeComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';
import { EditorShapeIsolatedModeComponent, IsolatedModeConfig } from './editor-shape-isolated-mode.component';

@Component({
  selector: 'lib-editor-shape-section',
  standalone: true,
  imports: [
    CommonModule,
    UIShapeComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorShapeIsolatedModeComponent
  ],
  templateUrl: './editor-shape-section.component.html'
})
export class EditorShapeSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('shapeElement', { static: false }) shapeElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Initial height check
    const shapeStyles = this.section.content['shapeStyles'] || {};
    if (shapeStyles.top && shapeStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(shapeStyles.left) || 0,
        y: parseInt(shapeStyles.top),
        width: parseInt(shapeStyles.width) || 200,
        height: parseInt(shapeStyles.height) || 200
      });
    }

    if (this.shapeElement) {
       this.applyElementVisualEditing(this.shapeElement, this.section.id + '_shape');
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getShapeConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleShapeEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_shape');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_shape') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateShapeStyles(event.bounds);
      }
    }
  }

  private updateShapeStyles(bounds: any): void {
    const currentStyles = this.section.content['shapeStyles'] || {};
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
          shapeStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const shapeStyles = this.section.content['shapeStyles'] || {};
    
    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_shape',
      type: 'shape',
      content: {
        shapeType: this.section.content['shapeType'],
        customPath: this.section.content['customPath']
      },
      styles: { ...shapeStyles },
      position: {
        x: parseInt(shapeStyles.left) || 0,
        y: parseInt(shapeStyles.top) || 0
      },
      size: {
        width: parseInt(shapeStyles.width) || 200,
        height: parseInt(shapeStyles.height) || 200
      }
    };
    this.showIsolatedMode = true;
  }

  onIsolatedModeClosed(): void {
    this.showIsolatedMode = false;
  }

  onIsolatedModeApplied(config: IsolatedModeConfig): void {
    this.variantService.updateSectionInCurrentPage(this.section.id, {
      content: {
        ...this.section.content,
        shapeType: config.content.shapeType,
        customPath: config.content.customPath,
        shapeStyles: config.styles,
        customStyles: config.styles
      }
    });
    this.showIsolatedMode = false;
  }
}
