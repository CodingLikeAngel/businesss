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
import { EditorMapIsolatedModeComponent, IsolatedModeConfig } from './editor-map-isolated-mode.component';

@Component({
  selector: 'lib-editor-map-section',
  standalone: true,
  imports: [
    CommonModule,
    UIMapComponent,
    ApplyDynamicStylesDirective,
    EnhancedVisualEditableDirective,
    EditorMapIsolatedModeComponent
  ],
  templateUrl: './editor-map-section.component.html'
})
export class EditorMapSectionComponent extends EnhancedBaseEditorSectionComponent implements AfterViewInit {
  @ViewChild('sectionElement', { static: true }) sectionElement!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElement?: ElementRef;

  // Isolated Mode State
  showIsolatedMode = false;
  isolatedConfig?: IsolatedModeConfig;

  ngAfterViewInit() {
    // Initial height check
    const mapStyles = this.section.content['mapStyles'] || {};
    if (mapStyles.top && mapStyles.height) {
      this.autoExpandSectionHeight({
        x: parseInt(mapStyles.left) || 0,
        y: parseInt(mapStyles.top),
        width: parseInt(mapStyles.width) || 400,
        height: parseInt(mapStyles.height) || 300
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

  openIsolatedMode(event: MouseEvent): void {
    event.stopPropagation();
    const mapStyles = this.section.content['mapStyles'] || {};

    this.isolatedConfig = {
      sectionId: this.section.id,
      elementId: this.section.id + '_map',
      type: 'map',
      content: {
        address: this.section.content['address'],
        zoom: this.section.content['zoom'],
        showOverlay: this.section.content['showOverlay']
      },
      styles: { ...mapStyles },
      position: {
        x: parseInt(mapStyles.left) || 0,
        y: parseInt(mapStyles.top) || 0
      },
      size: {
        width: parseInt(mapStyles.width) || 400,
        height: parseInt(mapStyles.height) || 300
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
        address: config.content.address,
        zoom: config.content.zoom,
        showOverlay: config.content.showOverlay,
        mapStyles: config.styles,
        customStyles: config.styles
      }
    });
    this.showIsolatedMode = false;
  }
}
