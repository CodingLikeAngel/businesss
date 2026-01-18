import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BoundaryConstraints, SafeZone, EnhancedElementBounds } from './enhanced-visual-editing.interfaces';

/**
 * Boundary Constraint Service
 * Handles advanced boundary constraints for visual editing elements
 */
@Injectable({
  providedIn: 'root'
})
export class BoundaryConstraintService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Calculate available boundaries for an element
   */
  calculateBoundaries(element: HTMLElement, config: BoundaryConstraints): BoundaryRect {
    if (!isPlatformBrowser(this.platformId)) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    const elementRect = element.getBoundingClientRect();
    let boundaries: BoundaryRect;

    switch (config.containment) {
      case 'parent':
        boundaries = this.getParentBoundaries(element);
        break;
      case 'viewport':
        boundaries = this.getViewportBoundaries();
        break;
      case 'container':
        boundaries = this.getContainerBoundaries(element);
        break;
      default:
        // Custom ElementRef containment
        boundaries = this.getCustomBoundaries(config.containment as ElementRef);
        break;
    }

    // Apply minimum distance constraints
    boundaries = this.applyMinDistance(boundaries, config.minDistance);

    // Apply safe zones
    boundaries = this.applySafeZones(boundaries, config.safeZones);

    return boundaries;
  }

  /**
   * Enforce boundary constraints on element bounds
   */
  enforceBoundaries(
    element: HTMLElement,
    newBounds: EnhancedElementBounds,
    config: BoundaryConstraints
  ): EnhancedElementBounds {
    const availableBoundaries = this.calculateBoundaries(element, config);

    let constrainedBounds = { ...newBounds };

    // Constrain to boundaries
    constrainedBounds.x = Math.max(
      availableBoundaries.left,
      Math.min(constrainedBounds.x, availableBoundaries.right - constrainedBounds.width)
    );

    constrainedBounds.y = Math.max(
      availableBoundaries.top,
      Math.min(constrainedBounds.y, availableBoundaries.bottom - constrainedBounds.height)
    );

    // Ensure element stays within bounds
    if (constrainedBounds.x + constrainedBounds.width > availableBoundaries.right) {
      constrainedBounds.x = availableBoundaries.right - constrainedBounds.width;
    }

    if (constrainedBounds.y + constrainedBounds.height > availableBoundaries.bottom) {
      constrainedBounds.y = availableBoundaries.bottom - constrainedBounds.height;
    }

    return constrainedBounds;
  }

  /**
   * Check for collisions with other elements
   */
  checkCollisions(
    element: HTMLElement,
    bounds: EnhancedElementBounds,
    excludeElements: HTMLElement[] = []
  ): CollisionInfo[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const collisions: CollisionInfo[] = [];
    const elements = document.querySelectorAll('[data-visual-editable="true"]');

    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl === element || excludeElements.includes(htmlEl)) {
        return;
      }

      const elRect = htmlEl.getBoundingClientRect();
      if (this.rectsIntersect(bounds, {
        x: elRect.left,
        y: elRect.top,
        width: elRect.width,
        height: elRect.height
      })) {
        collisions.push({
          element: htmlEl,
          bounds: {
            x: elRect.left,
            y: elRect.top,
            width: elRect.width,
            height: elRect.height
          },
          overlap: this.calculateOverlap(bounds, {
            x: elRect.left,
            y: elRect.top,
            width: elRect.width,
            height: elRect.height
          })
        });
      }
    });

    return collisions;
  }

  /**
   * Get parent element boundaries
   */
  private getParentBoundaries(element: HTMLElement): BoundaryRect {
    const parent = element.parentElement;
    if (!parent) {
      return this.getViewportBoundaries();
    }

    const parentRect = parent.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: parentRect.top + scrollY,
      right: parentRect.right + scrollX,
      bottom: parentRect.bottom + scrollY,
      left: parentRect.left + scrollX
    };
  }

  /**
   * Get viewport boundaries
   */
  private getViewportBoundaries(): BoundaryRect {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: scrollY,
      right: scrollX + window.innerWidth,
      bottom: scrollY + window.innerHeight,
      left: scrollX
    };
  }

  /**
   * Get container boundaries (closest container element)
   */
  private getContainerBoundaries(element: HTMLElement): BoundaryRect {
    // Find closest container (element with specific classes or data attributes)
    let container = element.closest('.editor-container, .visual-editing-container, [data-container="true"]') as HTMLElement;

    if (!container) {
      // Fallback to parent
      return this.getParentBoundaries(element);
    }

    const containerRect = container.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: containerRect.top + scrollY,
      right: containerRect.right + scrollX,
      bottom: containerRect.bottom + scrollY,
      left: containerRect.left + scrollX
    };
  }

  /**
   * Get custom element boundaries
   */
  private getCustomBoundaries(elementRef: ElementRef): BoundaryRect {
    const element = elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollY,
      right: rect.right + scrollX,
      bottom: rect.bottom + scrollY,
      left: rect.left + scrollX
    };
  }

  /**
   * Apply minimum distance constraints
   */
  private applyMinDistance(boundaries: BoundaryRect, minDistance: BoundaryConstraints['minDistance']): BoundaryRect {
    return {
      top: boundaries.top + minDistance.top,
      right: boundaries.right - minDistance.right,
      bottom: boundaries.bottom - minDistance.bottom,
      left: boundaries.left + minDistance.left
    };
  }

  /**
   * Apply safe zones to boundaries
   */
  private applySafeZones(boundaries: BoundaryRect, safeZones: SafeZone[]): BoundaryRect {
    let constrained = { ...boundaries };

    safeZones.forEach(zone => {
      if (zone.type === 'absolute') {
        // Reduce boundaries to avoid safe zone
        if (zone.bounds.x < constrained.right && zone.bounds.x + zone.bounds.width > constrained.left) {
          // Horizontal overlap - adjust vertical boundaries
          if (zone.bounds.y <= constrained.top) {
            constrained.top = Math.max(constrained.top, zone.bounds.y + zone.bounds.height);
          }
          if (zone.bounds.y + zone.bounds.height >= constrained.bottom) {
            constrained.bottom = Math.min(constrained.bottom, zone.bounds.y);
          }
        }

        if (zone.bounds.y < constrained.bottom && zone.bounds.y + zone.bounds.height > constrained.top) {
          // Vertical overlap - adjust horizontal boundaries
          if (zone.bounds.x <= constrained.left) {
            constrained.left = Math.max(constrained.left, zone.bounds.x + zone.bounds.width);
          }
          if (zone.bounds.x + zone.bounds.width >= constrained.right) {
            constrained.right = Math.min(constrained.right, zone.bounds.x);
          }
        }
      }
    });

    return constrained;
  }

  /**
   * Check if two rectangles intersect
   */
  private rectsIntersect(rect1: EnhancedElementBounds, rect2: { x: number; y: number; width: number; height: number }): boolean {
    return !(rect1.x + rect1.width <= rect2.x ||
             rect2.x + rect2.width <= rect1.x ||
             rect1.y + rect1.height <= rect2.y ||
             rect2.y + rect2.height <= rect1.y);
  }

  /**
   * Calculate overlap area between two rectangles
   */
  private calculateOverlap(rect1: EnhancedElementBounds, rect2: { x: number; y: number; width: number; height: number }): number {
    const overlapX = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
    const overlapY = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
    return overlapX * overlapY;
  }
}

/**
 * Boundary rectangle interface
 */
export interface BoundaryRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Collision information interface
 */
export interface CollisionInfo {
  element: HTMLElement;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  overlap: number;
}