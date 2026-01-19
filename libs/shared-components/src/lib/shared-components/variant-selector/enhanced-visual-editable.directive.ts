import { Directive, ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter, inject, OnChanges, SimpleChanges, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VisualEditorService } from './visual-editor.service';
import { BoundaryConstraintService } from './boundary-constraint.service';
import { UnifiedStylingService } from './unified-styling.service';
import { ElementGroupService } from './element-group.service';
import {
  VisualEditingConfig,
  VisualEditingEvent,
  EnhancedElementBounds,
  DEFAULT_CONFIGS,
  PlatformInfo
} from './enhanced-visual-editing.interfaces';

/**
 * Enhanced Visual Editable Directive
 * Provides standardized visual editing capabilities with advanced features
 */
@Directive({
  selector: '[enhancedVisualEditable]',
  standalone: true
})
export class EnhancedVisualEditableDirective implements OnInit, OnDestroy, OnChanges {
  @Input() enhancedVisualEditable!: VisualEditingConfig;
  @Input() elementId!: string;
  @Input() sectionId!: string;
  @Input() groupId?: string;
  @Input() isGroupMember = false;

  @Output() visualEvents = new EventEmitter<VisualEditingEvent>();

  private cleanup?: () => void;
  private currentConfig!: VisualEditingConfig;
  private platformInfo!: PlatformInfo;

  // Services
  private visualEditor = inject(VisualEditorService);
  private boundaryService = inject(BoundaryConstraintService);
  private stylingService = inject(UnifiedStylingService);
  private elementGroupService = inject(ElementGroupService);
  private platformId = inject(PLATFORM_ID);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.initializePlatformInfo();
    this.initializeConfiguration();
    this.setupVisualEditing();
    this.stylingService.injectBaseStyles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enhancedVisualEditable'] && !changes['enhancedVisualEditable'].firstChange) {
      this.updateConfiguration();
    }
  }

  ngOnDestroy() {
    this.cleanupVisualEditing();
  }

  /**
   * Initialize platform detection
   */
  private initializePlatformInfo(): void {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && isPlatformBrowser(this.platformId)) {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      this.platformInfo = {
        isMobile,
        isTouch,
        screenSize: window.innerWidth < 640 ? 'small' : window.innerWidth < 1024 ? 'medium' : 'large',
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        pixelRatio: window.devicePixelRatio || 1
      };
    } else {
      // SSR-safe defaults
      this.platformInfo = {
        isMobile: false,
        isTouch: false,
        screenSize: 'large',
        orientation: 'landscape',
        pixelRatio: 1
      };
    }
  }

  /**
   * Initialize configuration with defaults and platform adjustments
   */
  private initializeConfiguration(): void {
    const baseConfig = DEFAULT_CONFIGS[this.enhancedVisualEditable.type];
    this.currentConfig = {
      ...baseConfig,
      ...this.enhancedVisualEditable,
      // Apply platform-specific overrides
      styling: {
        ...baseConfig.styling,
        ...this.stylingService.getPlatformStyling(this.platformInfo.isMobile),
        ...this.enhancedVisualEditable.styling
      },
      interactions: {
        ...baseConfig.interactions,
        ...this.enhancedVisualEditable.interactions,
        touchEnabled: this.platformInfo.isTouch
      }
    };

    // Apply theme-specific styling
    if (this.currentConfig.styling.theme) {
      const themeStyling = this.stylingService.getThemeStyling(this.currentConfig.styling.theme);
      this.currentConfig.styling = { ...this.currentConfig.styling, ...themeStyling };
    }
  }

  /**
   * Update configuration when inputs change
   */
  private updateConfiguration(): void {
    this.cleanupVisualEditing();
    this.initializeConfiguration();
    this.setupVisualEditing();
  }

  /**
   * Setup visual editing with enhanced features
   */
  private setupVisualEditing(): void {
    if (!this.currentConfig.mobileSupport && this.platformInfo.isMobile) {
      return; // Skip setup on mobile if not supported
    }

    // Apply styling
    this.stylingService.applyStyling(this.el.nativeElement, this.currentConfig.styling);

    // Setup enhanced visual editor
    this.setupEnhancedEditor();
  }

  /**
   * Setup enhanced visual editor with boundary constraints
   */
  private setupEnhancedEditor(): void {
    const dragResizeConfig = this.createDragResizeConfig();

    this.cleanup = this.visualEditor.makeEditable(
      this.el.nativeElement,
      dragResizeConfig
    );

    // Setup enhanced event listeners
    this.setupEnhancedEventListeners();
  }

  /**
   * Create drag-resize configuration from visual editing config
   */
  private createDragResizeConfig() {
    const containment = this.currentConfig.constraints.containment;
    let dragContainment: 'parent' | 'viewport' | 'container' | ElementRef | undefined;

    if (containment === 'parent') {
      dragContainment = 'parent';
    } else if (containment === 'viewport') {
      dragContainment = 'viewport';
    } else if (containment === 'container') {
      dragContainment = 'parent'; // Fallback for container
    } else if (containment instanceof ElementRef) {
      dragContainment = containment;
    } else {
      dragContainment = undefined;
    }

    return {
      enableDrag: this.currentConfig.enableDrag,
      enableResize: this.currentConfig.enableResize,
      minWidth: 50,
      minHeight: 50,
      maxWidth: undefined,
      maxHeight: undefined,
      handles: {
        top: this.currentConfig.enableResize,
        right: this.currentConfig.enableResize,
        bottom: this.currentConfig.enableResize,
        left: this.currentConfig.enableResize,
        topLeft: this.currentConfig.enableResize,
        topRight: this.currentConfig.enableResize,
        bottomLeft: this.currentConfig.enableResize,
        bottomRight: this.currentConfig.enableResize
      },
      grid: this.currentConfig.interactions.snapToGrid,
      containment: dragContainment
    };
  }

  /**
   * Setup enhanced event listeners with boundary constraints
   */
  private setupEnhancedEventListeners(): void {
    // Enhanced resize event with boundary constraints
    this.visualEditor.elementResized$.subscribe(({ element, bounds }) => {
      if (element === this.el.nativeElement) {
        const enhancedBounds = this.createEnhancedBounds(bounds);
        const constrainedBounds = this.boundaryService.enforceBoundaries(
          element,
          enhancedBounds,
          this.currentConfig.constraints
        );

        // Check for collisions if enabled
        if (this.currentConfig.constraints.collisionDetection) {
          const collisions = this.boundaryService.checkCollisions(element, constrainedBounds);
          if (collisions.length > 0) {
            // Handle collisions (e.g., prevent move or adjust position)
            console.warn('Collision detected:', collisions);
          }
        }

        this.emitEvent('resized', element, constrainedBounds);
      }
    });

    // Enhanced move event with boundary constraints
    this.visualEditor.elementMoved$.subscribe(({ element, bounds }) => {
      if (element === this.el.nativeElement) {
        const enhancedBounds = this.createEnhancedBounds(bounds);
        const constrainedBounds = this.boundaryService.enforceBoundaries(
          element,
          enhancedBounds,
          this.currentConfig.constraints
        );

        this.emitEvent('moved', element, constrainedBounds);
      }
    });

    // Selection events
    this.visualEditor.elementSelected$.subscribe((element) => {
      if (element === this.el.nativeElement) {
        const bounds = element.getBoundingClientRect();
        const enhancedBounds = this.createEnhancedBounds({
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height
        });
        this.emitEvent('selected', element, enhancedBounds);
      }
    });

    this.visualEditor.elementDeselected$.subscribe(() => {
      if (this.visualEditor.getActiveElement() !== this.el.nativeElement) {
        const bounds = this.el.nativeElement.getBoundingClientRect();
        const enhancedBounds = this.createEnhancedBounds({
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height
        });
        this.emitEvent('deselected', this.el.nativeElement, enhancedBounds);
      }
    });
  }

  /**
   * Create enhanced bounds with metadata
   */
  private createEnhancedBounds(bounds: { x: number; y: number; width: number; height: number }): EnhancedElementBounds {
    return {
      ...bounds,
      elementId: this.elementId,
      sectionId: this.sectionId,
      timestamp: Date.now(),
      platform: this.platformInfo.isMobile ? 'mobile' : 'desktop'
    };
  }

  /**
   * Emit visual editing event
   */
  private emitEvent(type: VisualEditingEvent['type'], element: HTMLElement, bounds: EnhancedElementBounds): void {
    const event: VisualEditingEvent = {
      type,
      element,
      bounds,
      config: this.currentConfig,
      timestamp: Date.now()
    };

    this.visualEvents.emit(event);
  }

  /**
   * Cleanup visual editing
   */
  private cleanupVisualEditing(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }

    this.stylingService.removeStyling(this.el.nativeElement);
  }

  /**
   * Get current configuration (for external access)
   */
  getCurrentConfig(): VisualEditingConfig {
    return { ...this.currentConfig };
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: Partial<VisualEditingConfig>): void {
    this.enhancedVisualEditable = { ...this.enhancedVisualEditable, ...updates };
    this.updateConfiguration();
  }

  /**
   * Join an element group
   */
  joinGroup(groupId: string): void {
    this.groupId = groupId;
    this.isGroupMember = true;
    this.elementGroupService.addToGroup(groupId, [this.el.nativeElement]);
  }

  /**
   * Leave current group
   */
  leaveGroup(): void {
    if (this.groupId) {
      this.elementGroupService.removeFromGroup(this.groupId, [this.elementId]);
      this.groupId = undefined;
      this.isGroupMember = false;
    }
  }

  /**
   * Get relative position within group
   */
  getGroupRelativePosition(): { x: number; y: number } | null {
    if (!this.groupId) return null;

    const group = this.elementGroupService.getGroup(this.groupId);
    if (!group) return null;

    const groupElement = group.elements.find(ge => ge.elementId === this.elementId);
    return groupElement ? { ...groupElement.relativePosition } : null;
  }

  /**
   * Check if element is part of a group
   */
  isInGroup(): boolean {
    return this.isGroupMember && !!this.groupId;
  }

  /**
   * Get current group ID
   */
  getCurrentGroupId(): string | undefined {
    return this.groupId;
  }
}