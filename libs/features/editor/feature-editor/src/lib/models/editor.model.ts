// Enhanced Editor Models for Professional Page Builder

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Animation {
  type: 'fade' | 'slide' | 'bounce' | 'scale' | 'rotate';
  duration: number;
  delay: number;
  easing: string;
  repeat: boolean;
}

export interface Interaction {
  type: 'click' | 'hover' | 'scroll';
  action: 'openModal' | 'navigate' | 'playVideo' | 'custom';
  target?: string;
  data?: any;
}

export interface ResponsiveConfig {
  mobile: { visible: boolean; styles: any };
  tablet: { visible: boolean; styles: any };
  desktop: { visible: boolean; styles: any };
}

export interface ElementStyles {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  customCSS?: string;
}

export interface SectionStyles extends ElementStyles {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  minHeight?: string;
}

export interface ElementContent {
  text?: string;
  html?: string;
  image?: string;
  video?: string;
  link?: string;
  list?: string[];
  data?: any;
}

export interface SectionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: any[];
  customData?: any;
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'services'
  | 'products'
  | 'testimonials'
  | 'pricing'
  | 'gallery'
  | 'contact'
  | 'faq'
  | 'stats'
  | 'team'
  | 'blog'
  | 'cta'
  | 'promotions'
  | 'bubble'
  | 'custom';

export type ElementType =
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'button'
  | 'icon'
  | 'divider'
  | 'spacer'
  | 'list'
  | 'card'
  | 'form'
  | 'custom';

export interface Element {
  id: string;
  type: ElementType;
  position: Position;
  size?: Size;
  styles: ElementStyles;
  content: ElementContent;
  interactions: Interaction[];
  animations: Animation[];
  responsive: ResponsiveConfig;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  position: Position;
  size?: Size;
  styles: SectionStyles;
  content: SectionContent;
  elements: Element[];
  animations: Animation[];
  responsive: ResponsiveConfig;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  order?: number;
  config?: any;
}

export interface PageSection {
  id: string;
  type: SectionType;
  name: string;
  position: Position;
  size?: Size;
  styles: SectionStyles;
  content: SectionContent;
  elements: Element[];
  animations: Animation[];
  responsive: ResponsiveConfig;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  order?: number;
  config?: any;
}

export interface GlobalStyles {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: { h1: string; h2: string; h3: string; body: string };
  spacing: { small: string; medium: string; large: string };
  borderRadius: string;
  boxShadow: string;
  customCSS: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  ogImage?: string;
  favicon?: string;
  customMeta: { [key: string]: string };
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive: Date;
  cursor?: Position;
}

export interface PageVersion {
  id: string;
  name: string;
  timestamp: Date;
  author: string;
  changes: string[];
  snapshot: Page;
}

export interface Header {
  id: string;
  sections: Section[];
  visible: boolean;
  isGlobal?: boolean;
}

export interface Footer {
  id: string;
  sections: Section[];
  visible: boolean;
  isGlobal?: boolean;
}

export interface Navigation {
  headerLinks: { pageId: string; label: string }[];
  footerLinks: { pageId: string; label: string }[];
  globalHeaderId?: string;
  globalFooterId?: string;
}

export interface NavigationState {
  currentPath: string;
  activePageId: string | null;
  breadcrumbs: { label: string; path: string }[];
  isNavigating: boolean;
}

export interface PreviewState {
  isPreviewMode: boolean;
  previewPageId: string | null;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  showGrid: boolean;
  showRulers: boolean;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
  globalStyles: GlobalStyles;
  metadata: PageMetadata;
  versions: PageVersion[];
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  publishedAt?: Date;
  settings?: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    social?: {
      ogImage?: string;
      twitterCard?: string;
    };
    analytics?: {
      googleAnalyticsId?: string;
      facebookPixelId?: string;
    };
  };
  author?: string;
  order: number;
  visibleInHeader: boolean;
  visibleInFooter: boolean;
  isHomePage?: boolean;
}

// UI State Models
export interface EditorUIState {
  selectedElementId: string | null;
  selectedSectionId: string | null;
  hoveredElementId: string | null;
  draggedElementId: string | null;
  draggedSectionId: string | null;
  zoom: number;
  canvasSize: Size;
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  devicePreview: 'mobile' | 'tablet' | 'desktop';
  sidebarOpen: boolean;
  toolbarVisible: boolean;
  contextMenu: {
    visible: boolean;
    position: Position;
    targetId: string;
    targetType: 'element' | 'section' | 'canvas';
  };
}

export interface ModalState {
  isOpen: boolean;
  type: 'element-settings' | 'section-settings' | 'export' | 'import' | 'collaboration' | 'template-gallery' | 'custom';
  data?: any;
  selectedItem?: any;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

// Command Pattern for Undo/Redo
export interface Command {
  id: string;
  type: string;
  timestamp: Date;
  execute(): void;
  undo(): void;
  redo(): void;
  description: string;
}

export interface HistoryState {
  past: Command[];
  present: any;
  future: Command[];
  canUndo: boolean;
  canRedo: boolean;
}

// Export/Import Models
export interface ExportOptions {
  format: 'json' | 'html' | 'pdf' | 'react' | 'vue' | 'angular';
  includeAssets: boolean;
  minify: boolean;
  customCSS: boolean;
  responsive: boolean;
}

export interface ImportData {
  version: string;
  data: Page;
  metadata: {
    exportedAt: Date;
    exportedBy: string;
    source: string;
  };
}

// Template Models
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  preview: string;
  tags: string[];
  sections: Section[];
  globalStyles: GlobalStyles;
  popularity: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  premium: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: Template[];
}

// Analytics Models
export interface UsageAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  sessionDuration: number;
  bounceRate: number;
  popularSections: { sectionId: string; views: number }[];
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  timeRange: { start: Date; end: Date };
}

export interface EditorAnalytics {
  saves: number;
  publishes: number;
  exports: number;
  collaborations: number;
  timeSpent: number;
  featuresUsed: string[];
  errors: number;
}

// Legacy models for backward compatibility
export interface EditorSection {
  id: string;
  type: string;
  visible: boolean;
}

export interface BaseItem {
  description: string;
}

export interface ServiceItem extends BaseItem {
  serviceName: string;
  icon?: string;
}

export interface ProductItem extends BaseItem {
  name: string;
  image: string;
  price: string;
}

export interface CartItem extends ProductItem {
  quantity: number;
}

export interface EditorState {
  isMobile: boolean;
  modalState: ModalState;
  cartItems: CartItem[];
}

// Migration interfaces for backward compatibility
export interface LegacyPage {
  id: string;
  name: string;
  sections: LegacySection[];
  styles: any;
  metadata: any;
}

export interface LegacySection {
  id: string;
  type: string;
  content: any;
  styles: any;
}

export interface MigrationState {
  version: string;
  lastMigrated: Date | null;
  migrationHistory: MigrationRecord[];
}

export interface MigrationRecord {
  id: string;
  fromVersion: string;
  toVersion: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  details?: string;
}