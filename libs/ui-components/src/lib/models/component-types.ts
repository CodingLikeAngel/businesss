/**
 * Unified Component Types for UI Components Library
 * 
 * This file defines all standard interfaces, types, and enums
 * for consistent component props across the library.
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Standard variant types for all UI components
 * Based on global variants from ui-components-data.model.ts
 */
export type ComponentVariant = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'neon'
  | 'cyberpunk'
  | 'gradient'
  | 'glass'
  | 'retro'
  | 'pulse-gradient'
  | 'holo'
  | 'matrix'
  | 'quantum'
  | 'cybernetic'
  | 'danger'
  | 'success'
  | 'nano'
  | 'stellar'
  | 'phoenix'
  | 'galactic'
  | 'orbitron'
  | 'cartoon'
  | 'luma'
  | 'platform'
  | 'hero'
  | 'coin'
  | 'cloud'
  | 'fire'
  | 'water'
  | 'leaf'
  | 'amber-glow'
  | 'minimal-white'
  | 'minimal'
  | 'hex-teal'
  | 'purple-edge'
  | 'rose-radial'
  | 'yellow-pulse'
  | 'green-inset'
  | 'blue-skew'
  | 'orange-dash'
  | 'indigo-dots'
  | 'bubble'
  | 'electoon'
  | 'jungle'
  | 'joycon'
  | 'neomorph'
  | 'glitch'
  | 'portal'
  | 'bioshock'
  | 'super-meat-boy';

/**
 * Standard size types for all UI components
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Rounded options for components
 */
export type RoundedType = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Animation types for interactive components
 */
export type AnimationType = 
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'bounce'
  | 'pulse'
  | 'glitch'
  | 'flip'
  | 'rotate';

/**
 * Status types for components
 */
export type ComponentStatus = 'active' | 'inactive' | 'pending' | 'disabled' | 'error' | 'success';

// =============================================================================
// BASE COMPONENT INTERFACES
// =============================================================================

/**
 * Base props for all UI components
 */
export interface BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  rounded?: RoundedType;
  disabled?: boolean;
  customStyles?: Record<string, string>;
  className?: string;
}

/**
 * Base props for components with animations
 */
export interface AnimatedComponentProps extends BaseComponentProps {
  animation?: AnimationType;
  animationDuration?: number;
  animationDelay?: number;
  triggerAnimation?: boolean;
}

/**
 * Base props for clickable components
 */
export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: (event: Event) => void;
  onHover?: (event: Event) => void;
  onFocus?: (event: Event) => void;
}

// =============================================================================
// BUTTON COMPONENT TYPES
// =============================================================================

/**
 * Button-specific props
 */
export interface ButtonProps extends BaseComponentProps {
  // Content
  label?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  leadingIcon?: string;
  trailingIcon?: string;
  
  // States
  loading?: boolean;
  fullWidth?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  
  // Button-specific
  type?: 'button' | 'submit' | 'reset';
  
  // Events
  onClick?: (event: MouseEvent) => void;
  
  // Accessibility
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  
  // Additional features
  soundUrl?: string;
  haptic?: boolean;
}

/**
 * Button variant extensions
 */
export const buttonSpecificVariants = ['icon-only', 'text-only'] as const;
export type ButtonSpecificVariant = typeof buttonSpecificVariants[number];
export type FullButtonVariant = ComponentVariant | ButtonSpecificVariant;

// =============================================================================
// CARD COMPONENT TYPES
// =============================================================================

/**
 * Card size options
 */
export type CardSize = 'square' | 'wide' | 'tall' | 'auto';

/**
 * Image position options
 */
export type ImagePosition = 'top' | 'left' | 'right' | 'background' | 'none';

/**
 * Card action interface
 */
export interface CardAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: string;
}

/**
 * Card-specific props
 */
export interface CardProps extends AnimatedComponentProps {
  // Content
  title?: string;
  description?: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  avatar?: string;
  
  // Layout
  imagePosition?: ImagePosition;
  cardSize?: CardSize;
  
  // Interactive
  clickable?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  
  // Actions
  actions?: CardAction[];
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  
  // Status
  status?: ComponentStatus;
  
  // Events
  onActionClick?: (action: CardAction) => void;
  onCardClick?: () => void;
}

// =============================================================================
// HERO SECTION TYPES
// =============================================================================

/**
 * Hero layout variants
 */
export type HeroVariant = 'centered' | 'left-aligned' | 'right-aligned' | 'split' | 'fullscreen' | 'minimal';

/**
 * Background type options
 */
export type BackgroundType = 'image' | 'video' | 'gradient' | 'solid' | 'none';

/**
 * Height options
 */
export type HeroHeight = 'auto' | 'screen' | 'custom';

/**
 * Hero CTA configuration
 */
export interface HeroCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ComponentVariant;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

/**
 * Hero-specific props
 */
export interface HeroSectionProps {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  
  // CTA
  ctaLabel?: string;
  ctaHref?: string;
  ctaVariant?: ComponentVariant;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  showCta?: boolean;
  showSecondaryCta?: boolean;
  ctas?: HeroCTA[];
  
  // Background
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundType?: BackgroundType;
  backgroundColor?: string;
  backgroundGradient?: string;
  
  // Layout
  variant?: HeroVariant;
  height?: HeroHeight;
  customHeight?: number;
  
  // Overlay
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  
  // Styling
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // Interactive
  onCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  
  // Accessibility
  ariaLabel?: string;
}

// =============================================================================
// FORM COMPONENT TYPES
// =============================================================================

/**
 * Input types
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';

/**
 * Input validation state
 */
export type ValidationState = 'none' | 'valid' | 'invalid' | 'warning';

/**
 * Input-specific props
 */
export interface InputProps extends BaseComponentProps {
  type?: InputType;
  placeholder?: string;
  label?: string;
  value?: string | number;
  name?: string;
  required?: boolean;
  readonly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  error?: string;
  hint?: string;
  validationState?: ValidationState;
  icon?: string;
  iconPosition?: 'left' | 'right';
  
  // Events
  onInput?: (event: Event) => void;
  onChange?: (value: string | number) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
}

/**
 * Select option interface
 */
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

/**
 * Select-specific props
 */
export interface SelectProps extends BaseComponentProps {
  options?: SelectOption[];
  value?: string | number | null;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  
  // Events
  onChange?: (value: any) => void;
  onSearch?: (search: string) => void;
}

// =============================================================================
// MODAL/DIALOG TYPES
// =============================================================================

/**
 * Modal size options
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal configuration
 */
export interface ModalConfig {
  title?: string;
  size?: ModalSize;
  closable?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
  persistent?: boolean;
}

/**
 * Modal action/button
 */
export interface ModalAction {
  label: string;
  onClick?: () => void;
  variant?: ComponentVariant;
  disabled?: boolean;
  loading?: boolean;
}

// =============================================================================
// TABLE COMPONENT TYPES
// =============================================================================

/**
 * Table column definition
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  template?: string;
}

/**
 * Table row action
 */
export interface TableRowAction {
  label: string;
  icon?: string;
  onClick: (row: any) => void;
  variant?: ComponentVariant;
}

// =============================================================================
// NAVIGATION COMPONENT TYPES
// =============================================================================

/**
 * Navigation item
 */
export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  icon?: string;
  badge?: string;
  active?: boolean;
  disabled?: boolean;
}

/**
 * Navbar configuration
 */
export interface NavbarConfig {
  logo?: string;
  items?: NavItem[];
  sticky?: boolean;
  transparent?: boolean;
  searchEnabled?: boolean;
  userMenuEnabled?: boolean;
}

// =============================================================================
// EXPORT ALL
// =============================================================================

// Re-export for convenience
export * from './ui-components-data.model';
export * from './custom-styles.interface';
