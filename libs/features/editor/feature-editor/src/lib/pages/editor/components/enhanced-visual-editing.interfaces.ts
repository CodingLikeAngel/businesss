import { ElementRef } from '@angular/core';

export interface IsolatedModeConfig {
  sectionId: string;
  elementId: string;
  type: string;
  content: any;
  styles: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * Enhanced Visual Editing Configuration Interfaces
 * Provides type-safe configuration for standardized visual editing across editor components
 */

export type VisualEditingType = 'section' | 'element' | 'container';

export interface VisualEditingConfig {
  /** Type of element being edited */
  type: VisualEditingType;

  /** Enable drag functionality */
  enableDrag: boolean;

  /** Enable resize functionality */
  enableResize: boolean;

  /** Enable mobile/touch support */
  mobileSupport: boolean;

  /** Boundary constraints configuration */
  constraints: BoundaryConstraints;

  /** Visual styling configuration */
  styling: VisualStylingConfig;

  /** Interaction configuration */
  interactions: InteractionConfig;

  /** Custom configuration overrides */
  customConfig?: Partial<DragResizeConfig>;
}

export interface BoundaryConstraints {
  /** Containment type */
  containment: 'parent' | 'viewport' | 'container' | ElementRef;

  /** Minimum distance from boundaries */
  minDistance: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /** Enable collision detection with other elements */
  collisionDetection: boolean;

  /** Safe zones where elements cannot be placed */
  safeZones: SafeZone[];
}

export interface SafeZone {
  /** Zone identifier */
  id: string;

  /** Zone boundaries */
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /** Zone type for different behaviors */
  type: 'absolute' | 'relative';
}

export interface VisualStylingConfig {
  /** Selection outline style */
  selectionOutline: string;

  /** Enable hover effects */
  hoverEffects: boolean;

  /** Show dimension labels */
  dimensionLabels: boolean;

  /** Show resize handles */
  resizeHandles: boolean;

  /** Custom CSS classes */
  customClasses?: string[];

  /** Theme variant */
  theme?: string;
}

export interface InteractionConfig {
  /** Enable touch interactions */
  touchEnabled: boolean;

  /** Allow multiple element selection */
  multiSelect: boolean;

  /** Grid snap size (0 = no snap) */
  snapToGrid: number;

  /** Animation duration for transitions */
  animationDuration: number;

  /** Enable haptic feedback on mobile */
  hapticFeedback: boolean;
}

/**
 * Legacy DragResizeConfig interface for backward compatibility
 * Extended with enhanced features
 */
export interface DragResizeConfig {
  enableDrag: boolean;
  enableResize: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  handles?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  grid?: number;
  containment?: 'parent' | 'viewport' | ElementRef;
}

/**
 * Enhanced element bounds with additional metadata
 */
export interface EnhancedElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  elementId: string;
  sectionId: string;
  timestamp: number;
  platform: 'desktop' | 'mobile';
}

/**
 * Visual editing event types
 */
export type VisualEditingEventType =
  | 'selected'
  | 'deselected'
  | 'moved'
  | 'resized'
  | 'dragStart'
  | 'dragEnd'
  | 'resizeStart'
  | 'resizeEnd';

export interface VisualEditingEvent {
  type: VisualEditingEventType;
  element: HTMLElement;
  bounds: EnhancedElementBounds;
  config: VisualEditingConfig;
  timestamp: number;
}

/**
 * Platform detection utilities
 */
export interface PlatformInfo {
  isMobile: boolean;
  isTouch: boolean;
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
}

/**
 * Default configurations for different element types
 */
export const DEFAULT_CONFIGS: Record<VisualEditingType, Omit<VisualEditingConfig, 'type'>> = {
  section: {
    enableDrag: false,
    enableResize: true,
    mobileSupport: true,
    constraints: {
      containment: 'parent',
      minDistance: { top: 10, right: 10, bottom: 10, left: 10 },
      collisionDetection: false,
      safeZones: []
    },
    styling: {
      selectionOutline: '2px solid #6366f1',
      hoverEffects: true,
      dimensionLabels: true,
      resizeHandles: true
    },
    interactions: {
      touchEnabled: true,
      multiSelect: false,
      snapToGrid: 0,
      animationDuration: 200,
      hapticFeedback: false
    }
  },
  element: {
    enableDrag: true,
    enableResize: true,
    mobileSupport: true,
    constraints: {
      containment: 'parent',
      minDistance: { top: 5, right: 5, bottom: 5, left: 5 },
      collisionDetection: true,
      safeZones: []
    },
    styling: {
      selectionOutline: '2px solid #10b981',
      hoverEffects: true,
      dimensionLabels: true,
      resizeHandles: true
    },
    interactions: {
      touchEnabled: true,
      multiSelect: true,
      snapToGrid: 5,
      animationDuration: 150,
      hapticFeedback: true
    }
  },
  container: {
    enableDrag: false,
    enableResize: false,
    mobileSupport: false,
    constraints: {
      containment: 'viewport',
      minDistance: { top: 0, right: 0, bottom: 0, left: 0 },
      collisionDetection: false,
      safeZones: []
    },
    styling: {
      selectionOutline: '1px dashed #94a3b8',
      hoverEffects: false,
      dimensionLabels: false,
      resizeHandles: false
    },
    interactions: {
      touchEnabled: false,
      multiSelect: false,
      snapToGrid: 0,
      animationDuration: 0,
      hapticFeedback: false
    }
  }
};