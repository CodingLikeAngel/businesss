import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { ElementGroupService } from './element-group.service';
import { VisualEditorService } from './visual-editor.service';
import { ElementGroup, GroupEvent } from './enhanced-visual-editing.interfaces';

/**
 * Element Group Directive
 * Provides visual editing capabilities for element groups
 */
@Directive({
  selector: '[elementGroup]',
  standalone: true
})
export class ElementGroupDirective implements OnInit, OnDestroy, OnChanges {
  @Input() elementGroup!: ElementGroup;
  @Output() groupEvents = new EventEmitter<GroupEvent>();

  private cleanup?: () => void;
  private groupOverlay?: HTMLElement;

  // Services
  private elementGroupService = inject(ElementGroupService);
  private visualEditorService = inject(VisualEditorService);
  private el: ElementRef<HTMLElement> = inject(ElementRef);

  ngOnInit() {
    this.setupGroupEditing();
    this.subscribeToGroupEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elementGroup'] && !changes['elementGroup'].firstChange) {
      this.updateGroupOverlay();
    }
  }

  ngOnDestroy() {
    this.cleanupGroupEditing();
  }

  /**
   * Setup group-level visual editing
   */
  private setupGroupEditing(): void {
    if (!this.elementGroup.config.enableDrag && !this.elementGroup.config.enableResize) {
      return;
    }

    this.createGroupOverlay();
    this.setupGroupInteractions();
  }

  /**
   * Create visual overlay for the group
   */
  private createGroupOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'element-group-overlay';
    overlay.style.position = 'absolute';
    overlay.style.pointerEvents = 'auto';
    overlay.style.zIndex = '9998';

    // Position overlay
    this.updateOverlayPosition(overlay);

    // Add group label
    const label = document.createElement('div');
    label.className = 'group-label';
    label.textContent = this.elementGroup.name;
    label.style.cssText = `
      position: absolute;
      top: -28px;
      left: 50%;
      transform: translateX(-50%);
      background: #6366f1;
      color: white;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      pointer-events: none;
    `;
    overlay.appendChild(label);

    // Add selection border
    const border = document.createElement('div');
    border.className = 'group-selection-border';
    border.style.cssText = `
      position: absolute;
      inset: -2px;
      border: 2px solid #6366f1;
      border-radius: 4px;
      pointer-events: none;
      box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2),
                  0 0 20px rgba(99, 102, 241, 0.3);
      animation: pulse-border 2s ease-in-out infinite;
    `;
    overlay.appendChild(border);

    // Add resize handles if enabled
    if (this.elementGroup.config.enableResize) {
      this.createGroupResizeHandles(overlay);
    }

    document.body.appendChild(overlay);
    this.groupOverlay = overlay;
  }

  /**
   * Create resize handles for the group
   */
  private createGroupResizeHandles(overlay: HTMLElement): void {
    const handles = [
      { name: 'top', cursor: 'ns-resize', position: { top: '-6px', left: '50%', transform: 'translateX(-50%)' } },
      { name: 'right', cursor: 'ew-resize', position: { top: '50%', right: '-6px', transform: 'translateY(-50%)' } },
      { name: 'bottom', cursor: 'ns-resize', position: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' } },
      { name: 'left', cursor: 'ew-resize', position: { top: '50%', left: '-6px', transform: 'translateY(-50%)' } },
      { name: 'top-left', cursor: 'nwse-resize', position: { top: '-6px', left: '-6px' } },
      { name: 'top-right', cursor: 'nesw-resize', position: { top: '-6px', right: '-6px' } },
      { name: 'bottom-left', cursor: 'nesw-resize', position: { bottom: '-6px', left: '-6px' } },
      { name: 'bottom-right', cursor: 'nwse-resize', position: { bottom: '-6px', right: '-6px' } }
    ];

    handles.forEach(({ name, cursor, position }) => {
      const handle = document.createElement('div');
      handle.className = `group-resize-handle handle-${name}`;
      handle.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #6366f1;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        cursor: ${cursor};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        pointer-events: auto;
      `;
      handle.style.top = position.top || '';
      handle.style.right = position.right || '';
      handle.style.bottom = position.bottom || '';
      handle.style.left = position.left || '';
      handle.style.transform = position.transform || '';

      handle.addEventListener('mouseenter', () => {
        handle.style.background = '#6366f1';
        handle.style.transform = (position.transform || '') + ' scale(1.3)';
      });

      handle.addEventListener('mouseleave', () => {
        handle.style.background = 'white';
        handle.style.transform = position.transform || '';
      });

      overlay.appendChild(handle);
    });
  }

  /**
   * Setup group interaction handlers
   */
  private setupGroupInteractions(): void {
    if (!this.groupOverlay) return;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let groupStartBounds = { ...this.elementGroup.bounds };

    // Drag handler
    if (this.elementGroup.config.enableDrag) {
      const dragHandler = (e: MouseEvent) => {
        if (e.target !== this.groupOverlay && !(e.target as HTMLElement).classList.contains('group-selection-border')) {
          return;
        }

        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        groupStartBounds = { ...this.elementGroup.bounds };
        e.preventDefault();
        e.stopPropagation();
      };

      const dragMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        this.elementGroupService.moveGroup(this.elementGroup.id, deltaX, deltaY);
        this.updateOverlayPosition(this.groupOverlay!);
      };

      const dragEnd = () => {
        isDragging = false;
      };

      this.groupOverlay.addEventListener('mousedown', dragHandler);
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
    }

    // Resize handlers
    if (this.elementGroup.config.enableResize) {
      const resizeHandles = this.groupOverlay.querySelectorAll('.group-resize-handle');

      resizeHandles.forEach(handle => {
        let isResizing = false;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let resizeStartBounds = { ...this.elementGroup.bounds };

        const handleName = Array.from(handle.classList)
          .find(cls => cls.startsWith('handle-'))
          ?.replace('handle-', '');

        if (!handleName) return;

        handle.addEventListener('mousedown', (e: Event) => {
          const mouseEvent = e as MouseEvent;
          isResizing = true;
          resizeStartX = mouseEvent.clientX;
          resizeStartY = mouseEvent.clientY;
          resizeStartBounds = { ...this.elementGroup.bounds };
          mouseEvent.preventDefault();
          mouseEvent.stopPropagation();
        });

        const resizeMove = (e: MouseEvent) => {
          if (!isResizing) return;

          const deltaX = e.clientX - resizeStartX;
          const deltaY = e.clientY - resizeStartY;

          let newBounds = { ...resizeStartBounds };

          // Calculate new bounds based on handle
          switch (handleName) {
            case 'right':
              newBounds.width = resizeStartBounds.width + deltaX;
              break;
            case 'left':
              newBounds.width = resizeStartBounds.width - deltaX;
              newBounds.x = resizeStartBounds.x + deltaX;
              break;
            case 'bottom':
              newBounds.height = resizeStartBounds.height + deltaY;
              break;
            case 'top':
              newBounds.height = resizeStartBounds.height - deltaY;
              newBounds.y = resizeStartBounds.y + deltaY;
              break;
            case 'top-left':
              newBounds.width = resizeStartBounds.width - deltaX;
              newBounds.height = resizeStartBounds.height - deltaY;
              newBounds.x = resizeStartBounds.x + deltaX;
              newBounds.y = resizeStartBounds.y + deltaY;
              break;
            case 'top-right':
              newBounds.width = resizeStartBounds.width + deltaX;
              newBounds.height = resizeStartBounds.height - deltaY;
              newBounds.y = resizeStartBounds.y + deltaY;
              break;
            case 'bottom-left':
              newBounds.width = resizeStartBounds.width - deltaX;
              newBounds.height = resizeStartBounds.height + deltaY;
              newBounds.x = resizeStartBounds.x + deltaX;
              break;
            case 'bottom-right':
              newBounds.width = resizeStartBounds.width + deltaX;
              newBounds.height = resizeStartBounds.height + deltaY;
              break;
          }

          // Apply constraints
          newBounds.width = Math.max(newBounds.width, this.elementGroup.config.minWidth);
          newBounds.height = Math.max(newBounds.height, this.elementGroup.config.minHeight);

          if (this.elementGroup.config.maxWidth) {
            newBounds.width = Math.min(newBounds.width, this.elementGroup.config.maxWidth);
          }
          if (this.elementGroup.config.maxHeight) {
            newBounds.height = Math.min(newBounds.height, this.elementGroup.config.maxHeight);
          }

          // Apply grid snapping
          if (this.elementGroup.config.snapToGrid > 0) {
            const gridSize = this.elementGroup.config.snapToGrid;
            newBounds.width = Math.round(newBounds.width / gridSize) * gridSize;
            newBounds.height = Math.round(newBounds.height / gridSize) * gridSize;
          }

          this.elementGroupService.resizeGroup(this.elementGroup.id, newBounds, this.elementGroup.config.maintainAspectRatio);
          this.updateOverlayPosition(this.groupOverlay!);
        };

        const resizeEnd = () => {
          isResizing = false;
        };

        document.addEventListener('mousemove', resizeMove);
        document.addEventListener('mouseup', resizeEnd);
      });
    }
  }

  /**
   * Subscribe to group events
   */
  private subscribeToGroupEvents(): void {
    this.elementGroupService.groupEvents.subscribe(event => {
      if (event.groupId === this.elementGroup.id) {
        this.groupEvents.emit(event);

        // Update overlay when group changes
        if (this.groupOverlay) {
          this.updateOverlayPosition(this.groupOverlay);
        }
      }
    });
  }

  /**
   * Update overlay position
   */
  private updateOverlayPosition(overlay: HTMLElement): void {
    const bounds = this.elementGroup.bounds;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    overlay.style.left = `${bounds.x + scrollX}px`;
    overlay.style.top = `${bounds.y + scrollY}px`;
    overlay.style.width = `${bounds.width}px`;
    overlay.style.height = `${bounds.height}px`;
  }

  /**
   * Update group overlay when group changes
   */
  private updateGroupOverlay(): void {
    if (this.groupOverlay) {
      this.updateOverlayPosition(this.groupOverlay);
    }
  }

  /**
   * Cleanup group editing
   */
  private cleanupGroupEditing(): void {
    if (this.groupOverlay) {
      document.body.removeChild(this.groupOverlay);
      this.groupOverlay = undefined;
    }

    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }
  }
}