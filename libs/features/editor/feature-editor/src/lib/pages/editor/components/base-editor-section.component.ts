import { Component, Input, Output, EventEmitter, inject, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  PageSection,
  UiStateService,
  VariantService
} from '@negocio/shared-components';

@Component({
  template: ''
})
export abstract class BaseEditorSectionComponent {
  @Input() section!: PageSection;
  @Input()
  set isMobile(value: boolean) {
    this._isMobile = value;
  }
  get isMobile(): boolean {
    return this._isMobile;
  }
  private _isMobile = false;
  @Input() componentVariants: { [key: string]: string } = {};
  @Input() globalVariant = 'default';

  @Output() elementMoved = new EventEmitter<{ bounds: any; elementId: string }>();
  @Output() elementResized = new EventEmitter<{ bounds: any; elementId: string }>();
  @Output() sectionResized = new EventEmitter<{ section: PageSection; bounds: any }>();

  public uiStateService = inject(UiStateService);
  protected variantService = inject(VariantService);
  protected isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get selectedSectionId() {
    return this.uiStateService.selectedSection?.id;
  }

  get selectedElementId() {
    return this.uiStateService.selectedElement?.id;
  }

  getVariant(sectionId: string): any {
    const contentVariant = this.section?.content?.['variant'];
    if (contentVariant && contentVariant !== 'default') {
      return contentVariant;
    }
    const componentVariant = this.componentVariants[sectionId];
    if (componentVariant && componentVariant !== 'default') {
      return componentVariant;
    }
    return this.globalVariant || 'default';
  }

  selectSection(event: Event, section: PageSection) {
    event.stopPropagation();
    const sectionCopy = {
      ...section,
      content: { ...(section.content || {}) },
      styles: { ...(section.styles || {}) }
    };
    this.uiStateService.selectSection(sectionCopy);
  }

  selectElement(event: Event, element: any) {
    event.stopPropagation();
    this.uiStateService.selectElement(element);
  }

  getMergedElement(sectionId: string, elementId: string, item: any, type: string = 'element'): any {
    return {
      id: elementId,
      sectionId: sectionId,
      ...item,
      _original: item,
      isGlobal: this.section?.isGlobal,
      type
    };
  }

  onSectionResized(bounds: any) {
    this.sectionResized.emit({ section: this.section, bounds });
  }

  onElementMoved(bounds: any, elementId: string) {
    this.elementMoved.emit({ bounds, elementId });
  }

  onElementResized(bounds: any, elementId: string) {
    this.elementResized.emit({ bounds, elementId });
  }
}
