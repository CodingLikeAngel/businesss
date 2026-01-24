import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BoundaryConstraints, SafeZone, EnhancedElementBounds, ElementGroup, GroupBounds, CollisionResult } from './enhanced-visual-editing.interfaces';

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
   * Calculate available boundaries for an element in viewport coordinates
   */
  calculateBoundaries(element: HTMLElement, config: BoundaryConstraints): BoundaryRect {
    if (!isPlatformBrowser(this.platformId)) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

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
        if (config.containment instanceof ElementRef) {
          boundaries = this.getCustomBoundaries(config.containment);
        } else {
          boundaries = this.getViewportBoundaries();
        }
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
   * Check for collisions between groups
   */
  checkGroupCollisions(
    group: ElementGroup,
    allGroups: ElementGroup[],
    excludeGroups: string[] = []
  ): CollisionResult[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const collisions: CollisionResult[] = [];

    allGroups.forEach((otherGroup: ElementGroup) => {
      if (otherGroup.id === group.id || excludeGroups.includes(otherGroup.id)) {
        return;
      }

      const overlap = this.calculateGroupOverlap(group.bounds, otherGroup.bounds);
      if (overlap) {
        collisions.push({
          groupId: group.id,
          targetGroupId: otherGroup.id,
          collisionType: 'group-group',
          overlap,
          severity: this.calculateCollisionSeverity(overlap.width * overlap.height),
          suggestedResolution: this.calculateGroupCollisionResolution(group.bounds, otherGroup.bounds, overlap)
        });
      }
    });

    return collisions;
  }

  /**
   * Check collisions between a group and individual elements
   */
  checkGroupElementCollisions(
    group: ElementGroup,
    excludeElements: string[] = []
  ): CollisionResult[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const collisions: CollisionResult[] = [];
    const elements = document.querySelectorAll('[data-visual-editable="true"]:not(.element-group-member)');

    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      const elementId = htmlEl.getAttribute('data-element-id') || htmlEl.id;

      if (excludeElements.includes(elementId)) {
        return;
      }

      const elRect = htmlEl.getBoundingClientRect();
      const elementBounds = {
        x: elRect.left,
        y: elRect.top,
        width: elRect.width,
        height: elRect.height
      };

      const overlap = this.calculateGroupElementOverlap(group.bounds, elementBounds);
      if (overlap) {
        collisions.push({
          groupId: group.id,
          elementId,
          collisionType: 'group-element',
          overlap,
          severity: this.calculateCollisionSeverity(overlap.width * overlap.height),
          suggestedResolution: this.calculateGroupElementCollisionResolution(group.bounds, elementBounds, overlap)
        });
      }
    });

    return collisions;
  }

  /**
   * Resolve group collision by adjusting position
   */
  resolveGroupCollision(
    groupBounds: GroupBounds,
    collision: CollisionResult
  ): { deltaX: number; deltaY: number } {
    if (collision.suggestedResolution) {
      return collision.suggestedResolution;
    }

    const overlap = collision.overlap;
    return {
      deltaX: overlap.x < groupBounds.centerX ? overlap.width : -overlap.width,
      deltaY: overlap.y < groupBounds.centerY ? overlap.height : -overlap.height
    };
  }

  /**
   * Calculate overlap between two group bounds
   */
  private calculateGroupOverlap(bounds1: GroupBounds, bounds2: GroupBounds): { x: number; y: number; width: number; height: number } | null {
    const x1 = Math.max(bounds1.x, bounds2.x);
    const y1 = Math.max(bounds1.y, bounds2.y);
    const x2 = Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width);
    const y2 = Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height);

    const width = x2 - x1;
    const height = y2 - y1;

    if (width > 0 && height > 0) {
      return { x: x1, y: y1, width, height };
    }

    return null;
  }

  /**
   * Calculate overlap between group bounds and element bounds
   */
  private calculateGroupElementOverlap(
    groupBounds: GroupBounds,
    elementBounds: { x: number; y: number; width: number; height: number }
  ): { x: number; y: number; width: number; height: number } | null {
    const x1 = Math.max(groupBounds.x, elementBounds.x);
    const y1 = Math.max(groupBounds.y, elementBounds.y);
    const x2 = Math.min(groupBounds.x + groupBounds.width, elementBounds.x + elementBounds.width);
    const y2 = Math.min(groupBounds.y + groupBounds.height, elementBounds.y + elementBounds.height);

    const width = x2 - x1;
    const height = y2 - y1;

    if (width > 0 && height > 0) {
      return { x: x1, y: y1, width, height };
    }

    return null;
  }

  /**
   * Calculate collision severity based on overlap area
   */
  private calculateCollisionSeverity(overlapArea: number): 'minor' | 'moderate' | 'severe' {
    if (overlapArea < 100) return 'minor';
    if (overlapArea < 1000) return 'moderate';
    return 'severe';
  }

  /**
   * Calculate resolution for group-to-group collision
   */
  private calculateGroupCollisionResolution(
    bounds1: GroupBounds,
    bounds2: GroupBounds,
    overlap: { x: number; y: number; width: number; height: number }
  ): { deltaX: number; deltaY: number } {
    const deltaX = bounds1.centerX < bounds2.centerX ? -overlap.width : overlap.width;
    const deltaY = bounds1.centerY < bounds2.centerY ? -overlap.height : overlap.height;
    return { deltaX, deltaY };
  }

  /**
   * Calculate resolution for group-to-element collision
   */
  private calculateGroupElementCollisionResolution(
    groupBounds: GroupBounds,
    elementBounds: { x: number; y: number; width: number; height: number },
    overlap: { x: number; y: number; width: number; height: number }
  ): { deltaX: number; deltaY: number } {
    const elementCenterX = elementBounds.x + elementBounds.width / 2;
    const elementCenterY = elementBounds.y + elementBounds.height / 2;

    const deltaX = groupBounds.centerX < elementCenterX ? -overlap.width : overlap.width;
    const deltaY = groupBounds.centerY < elementCenterY ? -overlap.height : overlap.height;

    return { deltaX, deltaY };
  }

  /**
   * Get parent element boundaries in viewport coordinates
   */
  private getParentBoundaries(element: HTMLElement): BoundaryRect {
    const parent = element.parentElement;
    if (!parent) {
      return this.getViewportBoundaries();
    }

    const parentRect = parent.getBoundingClientRect();

    return {
      top: parentRect.top,
      right: parentRect.right,
      bottom: parentRect.bottom,
      left: parentRect.left
    };
  }

  /**
   * Get viewport boundaries
   */
  private getViewportBoundaries(): BoundaryRect {
    return {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  }

  /**
   * Get container boundaries in viewport coordinates
   */
  private getContainerBoundaries(element: HTMLElement): BoundaryRect {
    const container = element.closest('.editor-container, .visual-editing-container, [data-container="true"]') as HTMLElement;

    if (!container) {
      return this.getParentBoundaries(element);
    }

    const containerRect = container.getBoundingClientRect();

    return {
      top: containerRect.top,
      right: containerRect.right,
      bottom: containerRect.bottom,
      left: containerRect.left
    };
  }

  /**
   * Get custom element boundaries in viewport coordinates
   */
  private getCustomBoundaries(elementRef: ElementRef): BoundaryRect {
    const element = elementRef.nativeElement;
    const rect = element.getBoundingClientRect();

    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
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
        if (zone.bounds.x < constrained.right && zone.bounds.x + zone.bounds.width > constrained.left) {
          if (zone.bounds.y <= constrained.top) {
            constrained.top = Math.max(constrained.top, zone.bounds.y + zone.bounds.height);
          }
          if (zone.bounds.y + zone.bounds.height >= constrained.bottom) {
            constrained.bottom = Math.min(constrained.bottom, zone.bounds.y);
          }
        }

        if (zone.bounds.y < constrained.bottom && zone.bounds.y + zone.bounds.height > constrained.top) {
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