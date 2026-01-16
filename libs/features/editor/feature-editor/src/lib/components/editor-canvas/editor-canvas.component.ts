import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Page, Section, Element, Position } from '../../models/editor.model';
import { EditorFeatureState } from '../../store/state/app.state';
import * as PageSelectors from '../../store/selectors/page.selectors';
import * as UISelectors from '../../store/selectors/ui.selectors';
import * as PageActions from '../../store/actions/page.actions';
import * as UIActions from '../../store/actions/ui.actions';
import { SectionRendererComponent } from './section-renderer.component';
import { PageSelectorModalComponent } from '../page-selector/page-selector-modal.component';

@Component({
  selector: 'lib-editor-canvas',
  standalone: true,
  imports: [CommonModule, SectionRendererComponent, PageSelectorModalComponent],
  template: `
    <div class="editor-canvas"
         [class.dragging]="isDragging$ | async"
         [class.grid-visible]="showGrid$ | async"
         [style.transform]="'scale(' + (zoom$ | async) + ')'"
         #canvasContainer>

      <!-- Grid overlay -->
      <div class="grid-overlay" *ngIf="showGrid$ | async"></div>

      <!-- Sections -->
      <div class="sections-container">

        <div *ngFor="let section of sections$ | async; trackBy: trackBySectionId"
             [class.selected]="(selectedSectionId$ | async) === section.id"
             class="section-wrapper"
             [style.z-index]="section.zIndex"
             (click)="onSectionClick($event, section)"
             (contextmenu)="onSectionContextMenu($event, section)">

          <!-- Section content -->
          <div class="section-content"
               [class.locked]="section.locked"
               [style]="getSectionStyles(section)">

            <!-- Section toolbar (visible on hover/select) -->
            <div class="section-toolbar" *ngIf="(selectedSectionId$ | async) === section.id || (hoveredSectionId$ | async) === section.id">
              <button class="toolbar-btn" (click)="duplicateSection(section)" title="Duplicate">
                📋
              </button>
              <button class="toolbar-btn" (click)="deleteSection(section)" title="Delete">
                🗑️
              </button>
              <button class="toolbar-btn" (click)="toggleSectionLock(section)" [title]="section.locked ? 'Unlock' : 'Lock'">
                {{ section.locked ? '🔒' : '🔓' }}
              </button>
            </div>

            <!-- Section renderer -->
            <lib-section-renderer
              [section]="section"
              [isSelected]="(selectedSectionId$ | async) === section.id"
              [devicePreview]="(devicePreview$ | async) || 'desktop'"
              (elementSelect)="onElementSelect($event)"
              (elementHover)="onElementHover($event)">
            </lib-section-renderer>

          </div>

        </div>
      </div>

      <!-- Canvas overlay for interactions -->
      <div class="canvas-overlay"
           (click)="onCanvasClick($event)"
           (contextmenu)="onCanvasContextMenu($event)">
      </div>

      <!-- Context menu -->
      <div class="context-menu"
           *ngIf="(contextMenu$ | async)?.visible"
           [style.left.px]="(contextMenu$ | async)?.position.x"
           [style.top.px]="(contextMenu$ | async)?.position.y">
        <div class="context-menu-item" *ngFor="let item of contextMenuItems"
             (click)="executeContextAction(item.action)">
          {{ item.label }}
        </div>
      </div>

    </div>
    
    <!-- Page Selector Modal -->
    <lib-page-selector-modal
      *ngIf="showingPageSelector"
      [pages]="(pages$ | async) || []"
      [currentPageId]="currentPageId$ | async"
      (pageSelected)="onPageSelected($event)"
      (cancelled)="hidePageSelector()">
    </lib-page-selector-modal>
  `,
  styleUrls: ['./editor-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  private destroy$ = new Subject<void>();

  // Observables from store
  sections$: Observable<Section[]>;
  selectedSectionId$: Observable<string | null>;
  selectedElementId$: Observable<string | null>;
  hoveredElementId$: Observable<string | null>;
  draggedSectionId$: Observable<string | null>;
  isDragging$: Observable<boolean>;
  zoom$: Observable<number>;
  showGrid$: Observable<boolean>;
  snapToGrid$: Observable<boolean>;
  devicePreview$: Observable<'mobile' | 'tablet' | 'desktop'>;
  contextMenu$: Observable<any>;

  // Derived observables
  hoveredSectionId$: Observable<string | null>;

  // Context menu items
  contextMenuItems: { label: string; action: string }[] = [];

  constructor(private store: Store<EditorFeatureState>) {
    // Initialize observables
    this.sections$ = this.store.select(PageSelectors.selectVisibleSections);
    this.selectedSectionId$ = this.store.select(UISelectors.selectSelectedSectionId);
    this.selectedElementId$ = this.store.select(UISelectors.selectSelectedElementId);
    this.hoveredElementId$ = this.store.select(UISelectors.selectHoveredElementId);
    this.draggedSectionId$ = this.store.select(UISelectors.selectDraggedSectionId);
    this.isDragging$ = this.store.select(UISelectors.selectIsDragging);
    this.zoom$ = this.store.select(UISelectors.selectZoom);
    this.showGrid$ = this.store.select(UISelectors.selectShowGrid);
    this.snapToGrid$ = this.store.select(UISelectors.selectSnapToGrid);
    this.devicePreview$ = this.store.select(UISelectors.selectDevicePreview);
    this.contextMenu$ = this.store.select(UISelectors.selectContextMenu);
    this.pages$ = this.store.select(PageSelectors.selectPages);
    this.currentPageId$ = this.store.select(PageSelectors.selectCurrentPage).pipe(
      map(page => page?.id || null)
    );

    // Create derived observable for hovered section
    this.hoveredSectionId$ = combineLatest([
      this.sections$,
      this.hoveredElementId$
    ]).pipe(
      map(([sections, hoveredElementId]) => {
        if (!hoveredElementId) return null;
        for (const section of sections) {
          if (section.elements.some(el => el.id === hoveredElementId)) {
            return section.id;
          }
        }
        return null;
      })
    );
  }

  ngOnInit() {
    // Subscribe to context menu changes to update menu items
    this.contextMenu$.pipe(takeUntil(this.destroy$)).subscribe(contextMenu => {
      if (contextMenu.visible) {
        this.updateContextMenuItems(contextMenu.targetType, contextMenu.targetId);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
  onSectionClick(event: MouseEvent, section: Section) {
    event.stopPropagation();
    this.store.dispatch(UIActions.selectSection({ sectionId: section.id }));
  }

  onSectionContextMenu(event: MouseEvent, section: Section) {
    event.preventDefault();
    this.store.dispatch(UIActions.showContextMenu({
      position: { x: event.clientX, y: event.clientY },
      targetId: section.id,
      targetType: 'section'
    }));
  }

  onCanvasClick(event: MouseEvent) {
    this.store.dispatch(UIActions.clearSelection());
    this.store.dispatch(UIActions.hideContextMenu());
  }

  onCanvasContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.store.dispatch(UIActions.showContextMenu({
      position: { x: event.clientX, y: event.clientY },
      targetId: 'canvas',
      targetType: 'canvas'
    }));
  }

  onElementSelect(elementId: string) {
    this.store.dispatch(UIActions.selectElement({ elementId }));
  }

  onElementHover(elementId: string | null) {
    this.store.dispatch(UIActions.hoverElement({ elementId }));
  }

  // TODO: Implement drag and drop functionality
  // onSectionDragStart(section: Section) {
  //   this.store.dispatch(UIActions.startDragSection({ sectionId: section.id }));
  // }

  // onSectionDragEnd() {
  //   this.store.dispatch(UIActions.endDragSection());
  // }

  // onSectionDrop(event: CdkDragDrop<Section[]>) {
  //   if (event.previousIndex !== event.currentIndex) {
  //     this.store.dispatch(PageActions.moveSection({
  //       sectionId: event.item.data.id,
  //       newPosition: event.currentIndex
  //     }));
  //   }
  // }

  // Section actions
  duplicateSection(section: Section) {
    this.store.dispatch(PageActions.duplicateSection({ sectionId: section.id }));
  }

  deleteSection(section: Section) {
    this.store.dispatch(PageActions.deleteSection({ sectionId: section.id }));
  }

  toggleSectionLock(section: Section) {
    this.store.dispatch(PageActions.updateSection({
      sectionId: section.id,
      changes: { locked: !section.locked }
    }));
  }

  // Context menu actions
  executeContextAction(action: string) {
    switch (action) {
      case 'add-section':
        this.showPageSelector();
        break;
      case 'duplicate-section':
        // TODO: Implement duplicate section
        break;
      case 'delete-section':
        // TODO: Implement delete section
        break;
      default:
        break;
    }
    this.store.dispatch(UIActions.hideContextMenu());
  }

  // Page selection modal
  showPageSelector() {
    this.showingPageSelector = true;
  }

  hidePageSelector() {
    this.showingPageSelector = false;
  }

  onPageSelected(pageId: string) {
    this.selectedPageId = pageId;
    this.showingPageSelector = false;
    
    // TODO: Show component library modal to select which component to add
    // For now, we'll add a default hero section as example
    const newSection: Section = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'hero',
      name: 'New Hero Section',
      position: { x: 0, y: 0 },
      styles: {
        backgroundColor: '#ffffff',
        minHeight: '100vh'
      },
      content: {
        title: 'New Section',
        subtitle: 'Added to page'
      },
      elements: [],
      animations: [],
      responsive: {
        mobile: { visible: true, styles: {} },
        tablet: { visible: true, styles: {} },
        desktop: { visible: true, styles: {} }
      },
      visible: true,
      locked: false,
      zIndex: 1,
      pageId: pageId
    };
    
    this.store.dispatch(PageActions.addSection({ 
      section: newSection, 
      pageId: pageId 
    }));
  }

  // Utility methods
  getSectionStyles(section: Section): string {
    const styles: string[] = [];

    if (section.styles.backgroundColor) {
      styles.push(`background-color: ${section.styles.backgroundColor}`);
    }

    if (section.styles.minHeight) {
      styles.push(`min-height: ${section.styles.minHeight}`);
    }

    return styles.join('; ');
  }

  trackBySectionId(index: number, section: Section): string {
    return section.id;
  }

  private updateContextMenuItems(targetType: string, targetId: string) {
    switch (targetType) {
      case 'section':
        this.contextMenuItems = [
          { label: 'Duplicate Section', action: 'duplicate-section' },
          { label: 'Delete Section', action: 'delete-section' },
          { label: 'Move Up', action: 'move-section-up' },
          { label: 'Move Down', action: 'move-section-down' },
          { label: 'Lock Section', action: 'lock-section' },
        ];
        break;
      case 'canvas':
        this.contextMenuItems = [
          { label: 'Add Section', action: 'add-section' },
          { label: 'Paste', action: 'paste' },
          { label: 'Select All', action: 'select-all' },
        ];
        break;
      default:
        this.contextMenuItems = [];
    }
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          if (event.shiftKey) {
            // TODO: Redo
          } else {
            // TODO: Undo
          }
          event.preventDefault();
          break;
        case 'y':
          // TODO: Redo
          event.preventDefault();
          break;
        case 's':
          this.store.dispatch(PageActions.savePage());
          event.preventDefault();
          break;
      }
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      // TODO: Delete selected items
    }

    if (event.key === 'Escape') {
      this.store.dispatch(UIActions.clearSelection());
      this.store.dispatch(UIActions.hideContextMenu());
      this.hidePageSelector();
    }
  }

  // Page selection state
  showingPageSelector = false;
  selectedPageId: string | null = null;
  pages$: Observable<Page[]>;
  currentPageId$: Observable<string | null>;
}