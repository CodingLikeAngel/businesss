import { Component, Input, Output, EventEmitter, inject, Inject, PLATFORM_ID, Optional, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  PageSection,
  UiStateService,
  VariantService
} from '@negocio/shared-components';

@Component({
  template: ''
})
export abstract class BaseEditorSectionComponent implements OnInit, OnDestroy {
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
  protected cdr = inject(ChangeDetectorRef, { optional: true });
  protected destroy$ = new Subject<void>();

  /** Preview mode: true when builder step is 'preview'. Sections hide editor chrome unless showEditorControls is true. */
  isPreviewMode = false;
  /** When in preview mode, toggles visibility of section header and edit controls. */
  showEditorControls = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.variantService.builderStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => {
        this.isPreviewMode = step === 'preview';
        if (!this.isPreviewMode) {
          this.showEditorControls = false;
        }
        this.cdr?.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Toggle editor controls visibility in preview mode. */
  toggleEditorControlsInPreview(): void {
    this.showEditorControls = !this.showEditorControls;
    this.cdr?.detectChanges();
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
