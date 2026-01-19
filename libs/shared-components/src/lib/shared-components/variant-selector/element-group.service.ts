import { Injectable, ElementRef, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  ElementGroup,
  GroupElement,
  GroupBounds,
  GroupConfig,
  GroupEvent,
  GroupTransformation,
  CollisionResult,
  DEFAULT_GROUP_CONFIGS,
  EnhancedElementBounds
} from './enhanced-visual-editing.interfaces';
import { BoundaryConstraintService } from './boundary-constraint.service';

@Injectable({
  providedIn: 'root'
})
export class ElementGroupService {
  private renderer: Renderer2;
  private groups = new Map<string, ElementGroup>();
  private groupElements = new Map<string, Set<string>>(); // groupId -> elementIds
  private elementGroups = new Map<string, string>(); // elementId -> groupId

  // Event streams
  private groupEvents$ = new Subject<GroupEvent>();
  public readonly groupEvents = this.groupEvents$.asObservable();

  private activeGroup$ = new BehaviorSubject<ElementGroup | null>(null);
  public readonly activeGroup = this.activeGroup$.asObservable();

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(BoundaryConstraintService) private boundaryService: BoundaryConstraintService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Create a new element group
   */
  createGroup(
    elements: HTMLElement[],
    config: Partial<GroupConfig> = {},
    name?: string,
    sectionId: string = 'default'
  ): ElementGroup {
    if (elements.length === 0) {
      throw new Error('Cannot create group with no elements');
    }

    // Check if any elements are already in groups
    const conflictingElements = elements.filter(el =>
      this.elementGroups.has(this.getElementId(el))
    );

    if (conflictingElements.length > 0) {
      throw new Error('Some elements are already part of existing groups');
    }

    const groupId = this.generateGroupId();
    const groupName = name || `Group ${this.groups.size + 1}`;

    // Calculate group bounds
    const bounds = this.calculateGroupBounds(elements);

    // Create group elements with relative positions
    const groupElements: GroupElement[] = elements.map(element => {
      const elementId = this.getElementId(element);
      const rect = element.getBoundingClientRect();
      const relativePosition = {
        x: rect.left - bounds.x,
        y: rect.top - bounds.y
      };
      const relativeScale = { x: 1, y: 1 };

      return {
        elementId,
        element,
        relativePosition,
        relativeScale,
        originalBounds: this.createEnhancedBounds(rect, elementId, sectionId)
      };
    });

    // Merge default config with provided config
    const defaultConfig = DEFAULT_GROUP_CONFIGS['standard'];
    const finalConfig: GroupConfig = {
      ...defaultConfig,
      containment: 'parent',
      minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
      safeZones: [],
      ...config
    };

    const group: ElementGroup = {
      id: groupId,
      name: groupName,
      elements: groupElements,
      bounds,
      config: finalConfig,
      createdAt: Date.now(),
      sectionId,
      lastModified: Date.now()
    };

    // Register the group
    this.groups.set(groupId, group);
    this.groupElements.set(groupId, new Set(elements.map(el => this.getElementId(el))));

    elements.forEach(element => {
      const elementId = this.getElementId(element);
      this.elementGroups.set(elementId, groupId);
      this.addGroupClass(element);
    });

    // Emit creation event
    this.emitGroupEvent({
      type: 'created',
      groupId,
      elementIds: elements.map(el => this.getElementId(el)),
      bounds,
      timestamp: Date.now()
    });

    return group;
  }

  /**
   * Delete a group and release all elements
   */
  deleteGroup(groupId: string): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // Remove group classes and references
    group.elements.forEach(groupElement => {
      this.removeGroupClass(groupElement.element);
      this.elementGroups.delete(groupElement.elementId);
    });

    // Clean up maps
    this.groups.delete(groupId);
    this.groupElements.delete(groupId);

    // Clear active group if it was this one
    if (this.activeGroup$.value?.id === groupId) {
      this.activeGroup$.next(null);
    }

    // Emit deletion event
    this.emitGroupEvent({
      type: 'deleted',
      groupId,
      elementIds: group.elements.map(el => el.elementId),
      timestamp: Date.now()
    });
  }

  /**
   * Add elements to an existing group
   */
  addToGroup(groupId: string, elements: HTMLElement[]): void {
    const group = this.groups.get(groupId);
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }

    // Check for conflicts
    const conflictingElements = elements.filter(el =>
      this.elementGroups.has(this.getElementId(el))
    );

    if (conflictingElements.length > 0) {
      throw new Error('Some elements are already part of other groups');
    }

    // Add elements to group
    const newGroupElements: GroupElement[] = elements.map(element => {
      const elementId = this.getElementId(element);
      const rect = element.getBoundingClientRect();
      const relativePosition = {
        x: rect.left - group.bounds.x,
        y: rect.top - group.bounds.y
      };

      return {
        elementId,
        element,
        relativePosition,
        relativeScale: { x: 1, y: 1 },
        originalBounds: this.createEnhancedBounds(rect, elementId, group.sectionId)
      };
    });

    group.elements.push(...newGroupElements);
    group.lastModified = Date.now();

    // Update bounds
    group.bounds = this.calculateGroupBounds(group.elements.map(ge => ge.element));

    // Update maps
    const elementIds = elements.map(el => this.getElementId(el));
    elementIds.forEach(id => this.groupElements.get(groupId)!.add(id));

    elements.forEach(element => {
      const elementId = this.getElementId(element);
      this.elementGroups.set(elementId, groupId);
      this.addGroupClass(element);
    });

    // Emit event
    this.emitGroupEvent({
      type: 'elementAdded',
      groupId,
      elementIds,
      bounds: group.bounds,
      timestamp: Date.now()
    });
  }

  /**
   * Remove elements from a group
   */
  removeFromGroup(groupId: string, elementIds: string[]): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // Remove elements
    group.elements = group.elements.filter(ge => !elementIds.includes(ge.elementId));
    group.lastModified = Date.now();

    // Update maps
    const groupElementSet = this.groupElements.get(groupId)!;
    elementIds.forEach(id => {
      groupElementSet.delete(id);
      this.elementGroups.delete(id);
    });

    // Remove group classes
    elementIds.forEach(id => {
      const groupElement = group.elements.find(ge => ge.elementId === id);
      if (groupElement) {
        this.removeGroupClass(groupElement.element);
      }
    });

    // If group is empty, delete it
    if (group.elements.length === 0) {
      this.deleteGroup(groupId);
      return;
    }

    // Update bounds
    group.bounds = this.calculateGroupBounds(group.elements.map(ge => ge.element));

    // Emit event
    this.emitGroupEvent({
      type: 'elementRemoved',
      groupId,
      elementIds,
      bounds: group.bounds,
      timestamp: Date.now()
    });
  }

  /**
   * Move an entire group
   */
  moveGroup(groupId: string, deltaX: number, deltaY: number): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // Apply grid snapping if enabled
    if (group.config.snapToGrid > 0) {
      const gridSize = group.config.snapToGrid;
      deltaX = Math.round(deltaX / gridSize) * gridSize;
      deltaY = Math.round(deltaY / gridSize) * gridSize;
    }

    // Update group bounds
    const newBounds: GroupBounds = {
      ...group.bounds,
      x: group.bounds.x + deltaX,
      y: group.bounds.y + deltaY,
      centerX: group.bounds.centerX + deltaX,
      centerY: group.bounds.centerY + deltaY
    };

    group.bounds = newBounds;
    group.lastModified = Date.now();

    // Move all elements
    group.elements.forEach(groupElement => {
      const element = groupElement.element;
      const currentRect = element.getBoundingClientRect();
      const newLeft = currentRect.left + deltaX;
      const newTop = currentRect.top + deltaY;

      this.renderer.setStyle(element, 'left', `${newLeft}px`);
      this.renderer.setStyle(element, 'top', `${newTop}px`);
      this.renderer.setStyle(element, 'position', 'absolute');
    });

    // Emit event
    this.emitGroupEvent({
      type: 'moved',
      groupId,
      bounds: newBounds,
      timestamp: Date.now()
    });
  }

  /**
   * Resize an entire group
   */
  resizeGroup(
    groupId: string,
    newBounds: GroupBounds,
    maintainAspectRatio: boolean = false
  ): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // Apply constraints
    let finalBounds = { ...newBounds };

    if (maintainAspectRatio || group.config.maintainAspectRatio) {
      const aspectRatio = group.bounds.width / group.bounds.height;
      finalBounds.height = finalBounds.width / aspectRatio;
    }

    // Apply min/max constraints
    finalBounds.width = Math.max(finalBounds.width, group.config.minWidth);
    finalBounds.height = Math.max(finalBounds.height, group.config.minHeight);

    if (group.config.maxWidth) {
      finalBounds.width = Math.min(finalBounds.width, group.config.maxWidth);
    }
    if (group.config.maxHeight) {
      finalBounds.height = Math.min(finalBounds.height, group.config.maxHeight);
    }

    // Apply grid snapping
    if (group.config.snapToGrid > 0) {
      const gridSize = group.config.snapToGrid;
      finalBounds.width = Math.round(finalBounds.width / gridSize) * gridSize;
      finalBounds.height = Math.round(finalBounds.height / gridSize) * gridSize;
    }

    // Calculate scale factors
    const scaleX = finalBounds.width / group.bounds.width;
    const scaleY = finalBounds.height / group.bounds.height;

    // Resize elements proportionally
    group.elements.forEach(groupElement => {
      const element = groupElement.element;

      // Calculate new position and size
      const newLeft = group.bounds.x + (groupElement.relativePosition.x * scaleX);
      const newTop = group.bounds.y + (groupElement.relativePosition.y * scaleY);
      const newWidth = groupElement.originalBounds.width * scaleX;
      const newHeight = groupElement.originalBounds.height * scaleY;

      // Apply new dimensions
      this.renderer.setStyle(element, 'left', `${newLeft}px`);
      this.renderer.setStyle(element, 'top', `${newTop}px`);
      this.renderer.setStyle(element, 'width', `${newWidth}px`);
      this.renderer.setStyle(element, 'height', `${newHeight}px`);
      this.renderer.setStyle(element, 'position', 'absolute');
    });

    // Update group bounds
    finalBounds.centerX = finalBounds.x + finalBounds.width / 2;
    finalBounds.centerY = finalBounds.y + finalBounds.height / 2;

    group.bounds = finalBounds;
    group.lastModified = Date.now();

    // Emit event
    this.emitGroupEvent({
      type: 'resized',
      groupId,
      bounds: finalBounds,
      timestamp: Date.now()
    });
  }

  /**
   * Apply a transformation to a group
   */
  transformGroup(groupId: string, transformation: GroupTransformation): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // For now, only handle translate transformations
    // Scale and rotate can be added later
    if (transformation.type === 'translate' && transformation.deltaX !== undefined && transformation.deltaY !== undefined) {
      this.moveGroup(groupId, transformation.deltaX, transformation.deltaY);
    }

    // Emit event
    this.emitGroupEvent({
      type: 'transformed',
      groupId,
      transformation,
      timestamp: Date.now()
    });
  }

  /**
   * Check for collisions involving a group
   */
  checkGroupCollisions(groupId: string): CollisionResult[] {
    const group = this.groups.get(groupId);
    if (!group || !group.config.collisionDetection) return [];

    const allGroups = this.getAllGroups();
    const groupCollisions = this.boundaryService.checkGroupCollisions(group, allGroups, [groupId]);
    const elementCollisions = this.boundaryService.checkGroupElementCollisions(group);

    const collisions = [...groupCollisions, ...elementCollisions];

    // Emit collision event if any found
    if (collisions.length > 0) {
      this.emitGroupEvent({
        type: 'collisionDetected',
        groupId,
        collisions,
        timestamp: Date.now()
      });
    }

    return collisions;
  }

  /**
   * Resolve group collisions
   */
  resolveGroupCollisions(groupId: string, collisions: CollisionResult[]): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    // Use boundary service to resolve collisions
    let totalDeltaX = 0;
    let totalDeltaY = 0;

    collisions.forEach(collision => {
      const resolution = this.boundaryService.resolveGroupCollision(group.bounds, collision);
      totalDeltaX += resolution.deltaX;
      totalDeltaY += resolution.deltaY;
    });

    if (totalDeltaX !== 0 || totalDeltaY !== 0) {
      this.moveGroup(groupId, totalDeltaX, totalDeltaY);

      this.emitGroupEvent({
        type: 'collisionResolved',
        groupId,
        collisions,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get a group by ID
   */
  getGroup(groupId: string): ElementGroup | undefined {
    return this.groups.get(groupId);
  }

  /**
   * Get all groups
   */
  getAllGroups(): ElementGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Get groups in a specific section
   */
  getGroupsInSection(sectionId: string): ElementGroup[] {
    return this.getAllGroups().filter(group => group.sectionId === sectionId);
  }

  /**
   * Check if an element is part of a group
   */
  isElementInGroup(elementId: string): boolean {
    return this.elementGroups.has(elementId);
  }

  /**
   * Get the group ID for an element
   */
  getElementGroup(elementId: string): string | undefined {
    return this.elementGroups.get(elementId);
  }

  /**
   * Set active group
   */
  setActiveGroup(group: ElementGroup | null): void {
    this.activeGroup$.next(group);
  }

  /**
   * Get active group
   */
  getActiveGroup(): ElementGroup | null {
    return this.activeGroup$.value;
  }

  // Private helper methods

  private generateGroupId(): string {
    return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getElementId(element: HTMLElement): string {
    return element.getAttribute('data-element-id') ||
           element.id ||
           `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateGroupBounds(elements: HTMLElement[]): GroupBounds {
    if (elements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });

    const x = minX;
    const y = minY;
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return { x, y, width, height, centerX, centerY };
  }

  private createEnhancedBounds(
    rect: DOMRect,
    elementId: string,
    sectionId: string
  ): EnhancedElementBounds {
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      elementId,
      sectionId,
      timestamp: Date.now(),
      platform: 'desktop' // Could be made dynamic
    };
  }

  private calculateBoundsOverlap(bounds1: GroupBounds, bounds2: GroupBounds): { x: number; y: number; width: number; height: number } | null {
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

  private calculateCollisionSeverity(overlap: { width: number; height: number }): 'minor' | 'moderate' | 'severe' {
    const area = overlap.width * overlap.height;
    if (area < 100) return 'minor';
    if (area < 1000) return 'moderate';
    return 'severe';
  }

  private calculateCollisionResolution(
    bounds1: GroupBounds,
    bounds2: GroupBounds,
    overlap: { x: number; y: number; width: number; height: number }
  ): { deltaX: number; deltaY: number } {
    // Simple resolution: move the first bounds away from the second
    const center1X = bounds1.centerX;
    const center1Y = bounds1.centerY;
    const center2X = bounds2.centerX;
    const center2Y = bounds2.centerY;

    const deltaX = center1X < center2X ? -overlap.width : overlap.width;
    const deltaY = center1Y < center2Y ? -overlap.height : overlap.height;

    return { deltaX, deltaY };
  }

  private addGroupClass(element: HTMLElement): void {
    this.renderer.addClass(element, 'element-group-member');
  }

  private removeGroupClass(element: HTMLElement): void {
    this.renderer.removeClass(element, 'element-group-member');
  }

  private emitGroupEvent(event: GroupEvent): void {
    this.groupEvents$.next(event);
  }
}