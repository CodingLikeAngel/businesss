import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIMapComponent } from '@negocio/ui-components';
import {
  ApplyDynamicStylesDirective,
  EnhancedVisualEditableDirective,
  VisualEditingConfig,
  VisualEditingEvent
} from '@negocio/shared-components';
import { EnhancedBaseEditorSectionComponent } from '../enhanced-base-editor-section.component';

@Component({
  selector: 'lib-editor-map-section',
  standalone: true,
  imports: [
    CommonModule,
    UIMapComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective
  ],
  templateUrl: './editor-map-section.component.html'
})
export class EditorMapSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElement?: ElementRef;

  ngAfterViewInit() {
    // Initial height check
    const mapStyles = this.section.content['mapStyles'] || {};
    if (mapStyles.top && mapStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(mapStyles.left) || 0,
        y: parseInt(mapStyles.top),
        width: parseInt(mapStyles.width) || 600,
        height: parseInt(mapStyles.height) || 400
      });
    }

    if (this.mapElement) {
       this.applyElementVisualEditing(this.mapElement, this.section.id + '_map');
    }
  }

  getSectionConfig(): VisualEditingConfig {
    return this.createElementConfig('section');
  }

  getMapConfig(): VisualEditingConfig {
    return this.createElementConfig('element', {
      interactions: {
        snapToGrid: 5
      }
    });
  }

  handleSectionEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id);
  }

  handleMapEvent(event: VisualEditingEvent): void {
    this.handleVisualEvent(event, this.section.id + '_map');
  }

  protected override onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    if (elementId === this.section.id + '_map') {
      if (['moved', 'resized'].includes(event.type)) {
        this.updateMapStyles(event.bounds);
      }
    }
  }

  private updateMapStyles(bounds: any): void {
    const currentStyles = this.section.content['mapStyles'] || {};
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
          mapStyles: newStyles,
          customStyles: newStyles
        }
      });

      this.autoExpandSectionHeight(bounds);
    }
  }
}
