import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { BaseEditorSectionComponent } from './base-editor-section.component';
import { EnhancedVisualEditableDirective, VisualEditingConfig, VisualEditingEvent, DEFAULT_CONFIGS, PlatformInfo } from '@negocio/shared-components';

/**
 * Enhanced Base Editor Section Component
 * Extends BaseEditorSectionComponent with unified visual editing methods
 * and standardized configurations for consistent behavior across all editor components
 */
@Component({
  template: '',
  standalone: true
})
export abstract class EnhancedBaseEditorSectionComponent extends BaseEditorSectionComponent implements OnInit, OnDestroy {
  // Injected services for enhanced functionality
  protected platformInfo!: PlatformInfo;

  // Visual editing state
  protected activeVisualElements = new Map<string, EnhancedVisualEditableDirective>();
  protected visualEditingEnabled = true;

  ngOnInit() {
    super.ngOnInit();
    this.initializePlatformDetection();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.cleanupAllVisualEditing();
  }

  /**
   * Initialize platform detection for responsive behavior
   */
  private initializePlatformDetection(): void {
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
  }

  /**
   * Apply visual editing to an element with standardized configuration
   */
  protected applyVisualEditing(
    elementRef: ElementRef<HTMLElement>,
    config: Partial<VisualEditingConfig>,
    elementId: string
  ): void {
    if (!this.visualEditingEnabled) return;

    // Create full configuration with defaults
    const fullConfig = this.createVisualEditingConfig(config);

    // Apply the directive programmatically or ensure it's applied
    this.setupVisualEditableDirective(elementRef, fullConfig, elementId);
  }

  /**
   * Remove visual editing from an element
   */
  protected removeVisualEditing(elementId: string): void {
    const directive = this.activeVisualElements.get(elementId);
    if (directive) {
      // The directive handles its own cleanup
      this.activeVisualElements.delete(elementId);
    }
  }

  /**
   * Update visual editing configuration for an element
   */
  protected updateVisualConfig(
    elementId: string,
    updates: Partial<VisualEditingConfig>
  ): void {
    const directive = this.activeVisualElements.get(elementId);
    if (directive) {
      directive.updateConfig(updates);
    }
  }

  /**
   * Create standardized visual editing configuration
   */
  private createVisualEditingConfig(partialConfig: Partial<VisualEditingConfig>): VisualEditingConfig {
    const type = partialConfig.type || 'element';
    const baseConfig = DEFAULT_CONFIGS[type];

    return {
      ...baseConfig,
      ...partialConfig,
      // Apply platform-specific adjustments
      mobileSupport: partialConfig.mobileSupport !== undefined ?
        partialConfig.mobileSupport : !this.platformInfo.isMobile,
      interactions: {
        ...baseConfig.interactions,
        touchEnabled: this.platformInfo.isTouch,
        ...partialConfig.interactions
      }
    };
  }

  /**
   * Setup visual editable directive on an element
   */
  private setupVisualEditableDirective(
    elementRef: ElementRef<HTMLElement>,
    config: VisualEditingConfig,
    elementId: string
  ): void {
    // For now, we assume the directive is applied in templates
    // In the future, this could create the directive programmatically
    // This method serves as a hook for future enhancement
    console.log(`Setting up visual editing for ${elementId}:`, config);
  }

  /**
   * Handle visual editing events with standardized processing
   */
  protected handleVisualEvent(event: VisualEditingEvent, elementId: string): void {
    // Log event for debugging
    console.log(`Visual event ${event.type} for ${elementId}:`, event);

    // Emit appropriate events based on event type
    switch (event.type) {
      case 'moved':
        this.elementMoved.emit({
          bounds: {
            x: event.bounds.x,
            y: event.bounds.y,
            width: event.bounds.width,
            height: event.bounds.height
          },
          elementId
        });
        break;

      case 'resized':
        this.elementResized.emit({
          bounds: {
            x: event.bounds.x,
            y: event.bounds.y,
            width: event.bounds.width,
            height: event.bounds.height
          },
          elementId
        });
        break;

      case 'selected':
        // Handle selection if needed
        break;

      case 'deselected':
        // Handle deselection if needed
        break;
    }

    // Call component-specific event handler
    this.onVisualEvent(event, elementId);
  }

  /**
   * Component-specific visual event handler (to be overridden by subclasses)
   */
  protected onVisualEvent(event: VisualEditingEvent, elementId: string): void {
    // Default implementation - can be overridden
  }

  /**
   * Enable or disable visual editing for all elements
   */
  protected setVisualEditingEnabled(enabled: boolean): void {
    this.visualEditingEnabled = enabled;

    if (!enabled) {
      this.cleanupAllVisualEditing();
    } else {
      // Re-enable would require re-initializing all elements
      // This could be implemented if needed
    }
  }

  /**
   * Cleanup all visual editing elements
   */
  private cleanupAllVisualEditing(): void {
    this.activeVisualElements.clear();
  }

  /**
   * Get platform information for conditional logic
   */
  protected getPlatformInfo(): PlatformInfo {
    return { ...this.platformInfo };
  }

  /**
   * Check if current platform supports visual editing
   */
  protected supportsVisualEditing(): boolean {
    return !this.platformInfo.isMobile || this.visualEditingEnabled;
  }

  /**
   * Create element-specific configuration with common patterns
   */
  protected createElementConfig(
    type: 'section' | 'element' | 'container',
    overrides: Partial<VisualEditingConfig> = {}
  ): VisualEditingConfig {
    return this.createVisualEditingConfig({ type, ...overrides });
  }

  /**
   * Apply visual editing to section element (common pattern)
   */
  protected applySectionVisualEditing(
    elementRef: ElementRef<HTMLElement>,
    sectionId: string,
    overrides: Partial<VisualEditingConfig> = {}
  ): void {
    this.applyVisualEditing(
      elementRef,
      this.createElementConfig('section', {
        enableDrag: false, // Sections typically don't move
        enableResize: true,
        ...overrides
      }),
      sectionId
    );
  }

  /**
   * Apply visual editing to content element (common pattern)
   */
  protected applyElementVisualEditing(
    elementRef: ElementRef<HTMLElement>,
    elementId: string,
    overrides: Partial<VisualEditingConfig> = {}
  ): void {
    this.applyVisualEditing(
      elementRef,
      this.createElementConfig('element', {
        enableDrag: true,
        enableResize: true,
        ...overrides
      }),
      elementId
    );
  }

  /**
   * Apply visual editing to container element (common pattern)
   */
  protected applyContainerVisualEditing(
    elementRef: ElementRef<HTMLElement>,
    containerId: string,
    overrides: Partial<VisualEditingConfig> = {}
  ): void {
    this.applyVisualEditing(
      elementRef,
      this.createElementConfig('container', {
        enableDrag: false,
        enableResize: false,
        ...overrides
      }),
      containerId
    );
  }
}