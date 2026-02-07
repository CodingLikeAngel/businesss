import { ElementRef } from '@angular/core';

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
 * Element Group Interfaces
 */
export interface ElementGroup {
  id: string;
  name: string;
  elements: GroupElement[];
  bounds: GroupBounds;
  config: GroupConfig;
  createdAt: number;
  sectionId: string;
  lastModified: number;
}

export interface GroupElement {
  elementId: string;
  element: HTMLElement;
  relativePosition: { x: number; y: number };
  relativeScale: { x: number; y: number };
  originalBounds: EnhancedElementBounds;
}

export interface GroupBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface GroupConfig {
  enableDrag: boolean;
  enableResize: boolean;
  maintainAspectRatio: boolean;
  proportionalScaling: boolean;
  collisionDetection: boolean;
  snapToGrid: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  containment: 'parent' | 'viewport' | 'container' | ElementRef;
  minDistance: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  safeZones: SafeZone[];
}

export interface GroupTransformation {
  type: 'translate' | 'scale' | 'rotate';
  deltaX?: number;
  deltaY?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  originX?: number;
  originY?: number;
}

export interface CollisionResult {
  groupId: string;
  targetGroupId?: string;
  elementId?: string;
  collisionType: 'group-group' | 'group-element' | 'group-boundary';
  overlap: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity: 'minor' | 'moderate' | 'severe';
  suggestedResolution?: {
    deltaX: number;
    deltaY: number;
  };
}

/**
 * Group Operation Events
 */
export type GroupOperationType =
  | 'created'
  | 'deleted'
  | 'elementAdded'
  | 'elementRemoved'
  | 'moved'
  | 'resized'
  | 'transformed'
  | 'collisionDetected'
  | 'collisionResolved';

export interface GroupEvent {
  type: GroupOperationType;
  groupId: string;
  elementIds?: string[];
  bounds?: GroupBounds;
  transformation?: GroupTransformation;
  collisions?: CollisionResult[];
  timestamp: number;
  userId?: string;
}

/**
 * Multi-Selection Interfaces
 */
export interface MultiSelectionState {
  selectedElements: Set<HTMLElement>;
  selectionBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  activeGroup: ElementGroup | null;
  selectionMode: 'single' | 'multi' | 'group';
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

/**
 * Default group configurations
 */
export const DEFAULT_GROUP_CONFIGS: Record<string, Omit<GroupConfig, 'containment' | 'minDistance' | 'safeZones'>> = {
  standard: {
    enableDrag: true,
    enableResize: true,
    maintainAspectRatio: false,
    proportionalScaling: true,
    collisionDetection: true,
    snapToGrid: 5,
    minWidth: 50,
    minHeight: 50
  },
  layout: {
    enableDrag: true,
    enableResize: false,
    maintainAspectRatio: false,
    proportionalScaling: false,
    collisionDetection: false,
    snapToGrid: 0,
    minWidth: 100,
    minHeight: 50
  },
  fixed: {
    enableDrag: false,
    enableResize: false,
    maintainAspectRatio: true,
    proportionalScaling: false,
    collisionDetection: true,
    snapToGrid: 10,
    minWidth: 200,
    minHeight: 100
  }
};

/**
 * Isolated Mode Configuration
 */
export interface IsolatedModeConfig {
  /** Unique identifier for the isolated mode instance */
  id: string;
  
  /** Type of component being edited */
  componentType: string;
  
  /** Current content configuration */
  content: Record<string, any>;
  
  /** Current style configuration */
  styles: Record<string, string>;
  
  /** Available variants */
  variants?: string[];
  
  /** Original config for comparison */
  originalConfig?: IsolatedModeConfig;
  
  /** Metadata */
  metadata?: {
    createdAt: number;
    modifiedAt: number;
    modifiedBy?: string;
  };
}

/**
 * Isolated Mode Events
 */
export type IsolatedModeEventType = 'opened' | 'closed' | 'applied' | 'cancelled' | 'changed';

export interface IsolatedModeEvent {
  type: IsolatedModeEventType;
  config: IsolatedModeConfig;
  timestamp: number;
}

/**
 * Preview Configuration for Isolated Mode
 */
export interface PreviewConfig {
  /** Preview width */
  width?: number | 'auto';
  
  /** Preview height */
  height?: number | 'auto';
  
  /** Background color of preview canvas */
  backgroundColor?: string;
  
  /** Enable grid overlay */
  showGrid?: boolean;
  
  /** Grid size in pixels */
  gridSize?: number;
  
  /** Enable responsive preview */
  responsive?: boolean;
  
  /** Available breakpoints for preview */
  breakpoints?: {
    name: string;
    width: number;
    icon: string;
  }[];
}

/**
 * Control Panel Configuration
 */
export interface ControlPanelConfig {
  /** Show content controls */
  showContent?: boolean;
  
  /** Show style controls */
  showStyles?: boolean;
  
  /** Show layout controls */
  showLayout?: boolean;
  
  /** Show background controls */
  showBackground?: boolean;
  
  /** Show animation controls */
  showAnimation?: boolean;
  
  /** Custom control sections */
  customSections?: ControlSection[];
}

/**
 * Control Section Definition
 */
export interface ControlSection {
  /** Section ID */
  id: string;
  
  /** Section title */
  title: string;
  
  /** Section icon (emoji or class) */
  icon?: string;
  
  /** Section controls */
  controls: ControlDefinition[];
  
  /** Section visibility condition */
  visibleWhen?: (config: IsolatedModeConfig) => boolean;
}

/**
 * Control Definition
 */
export interface ControlDefinition {
  /** Control ID (maps to config property) */
  id: string;
  
  /** Control type */
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'color' | 'slider' | 'range' | 'button' | 'icon-select' | 'gradient';
  
  /** Control label */
  label: string;
  
  /** Control placeholder */
  placeholder?: string;
  
  /** Control options (for select) */
  options?: { value: string; label: string; icon?: string }[];
  
  /** Control constraints */
  min?: number;
  max?: number;
  step?: number;
  
  /** Default value */
  defaultValue?: any;
  
  /** Required flag */
  required?: boolean;
  
  /** Help text */
  helpText?: string;
  
  /** Conditional visibility */
  visibleWhen?: (config: IsolatedModeConfig) => boolean;
  
  /** On change callback */
  onChange?: (value: any, config: IsolatedModeConfig) => void;
}