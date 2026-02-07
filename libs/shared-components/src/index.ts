export * from './services/variant-rotation.service';
export * from './services/device-resolver.service';
export * from './services/variant.service';
export * from './services/template.service';
export * from './guards/device.guard';
export * from './lib/shared-components/chat-component/chat-component.component';
export * from './lib/shared-components/template-selector/template-selector.component';
export * from './lib/shared-components/variant-selector/variant-selector.component';
export * from './services/loading-service.service';
export * from './services/ai.service';
export * from './lib/shared-components/variant-selector/ui-state.service';

// Visual Editor System
export * from './lib/shared-components/variant-selector/variant-registry';
export * from './lib/shared-components/variant-selector/visual-editor.service';
export { SimpleVisualEditorService, SimpleEditableElement, DragState, ResizeState } from './services/simple-visual-editor.service';
export * from './lib/shared-components/variant-selector/visual-editable.directive';
export * from './lib/shared-components/variant-selector/enhanced-visual-editable.directive';
export { VisualEditingConfig, VisualEditingEvent, DEFAULT_CONFIGS, PlatformInfo, IsolatedModeConfig, IsolatedModeEvent, IsolatedModeEventType, PreviewConfig, ControlPanelConfig, ControlSection, ControlDefinition } from './lib/shared-components/variant-selector/enhanced-visual-editing.interfaces';
export * from './lib/shared-components/variant-selector/boundary-constraint.service';
export * from './lib/shared-components/variant-selector/unified-styling.service';
export * from './lib/shared-components/variant-selector/design-editor.component';
export * from './lib/shared-components/variant-selector/apply-dynamic-styles.directive';

// Element Grouping System
export * from './lib/shared-components/variant-selector/element-group.service';
export * from './lib/shared-components/variant-selector/element-group.directive';

// Isolated Mode Components
export * from './lib/shared-components/variant-selector/hero-isolated-mode/editor-hero-isolated-mode.component';
export * from './lib/shared-components/variant-selector/features-isolated-mode/editor-features-isolated-mode.component';
export * from './lib/shared-components/variant-selector/testimonials-isolated-mode/editor-testimonials-isolated-mode.component';
export * from './lib/shared-components/variant-selector/pricing-isolated-mode/editor-pricing-isolated-mode.component';
export * from './lib/shared-components/variant-selector/gallery-isolated-mode/editor-gallery-isolated-mode.component';
export * from './lib/shared-components/variant-selector/contact-isolated-mode/editor-contact-isolated-mode.component';
export * from './lib/shared-components/variant-selector/cta-isolated-mode/editor-cta-isolated-mode.component';
export * from './lib/shared-components/variant-selector/stats-isolated-mode/editor-stats-isolated-mode.component';
export * from './lib/shared-components/variant-selector/products-isolated-mode/editor-products-isolated-mode.component';
export * from './lib/shared-components/variant-selector/newsletter-isolated-mode/editor-newsletter-isolated-mode.component';
export * from './lib/shared-components/variant-selector/faq-isolated-mode/editor-faq-isolated-mode.component';
export * from './lib/shared-components/variant-selector/steps-isolated-mode/editor-steps-isolated-mode.component';
export * from './lib/shared-components/variant-selector/reservation-isolated-mode/editor-reservation-isolated-mode.component';
export * from './lib/shared-components/variant-selector/promotions-isolated-mode/editor-promotions-isolated-mode.component';

// Industry-Specific Isolated Mode Components
export * from './lib/shared-components/variant-selector/restaurant-isolated-mode';
export * from './lib/shared-components/variant-selector/gym-isolated-mode';
export * from './lib/shared-components/variant-selector/spa-isolated-mode';

// Isolated Mode Integration Service
export * from './lib/shared-components/variant-selector/isolated-mode-integration.service';
export { IsolatedModeComponentType, ComponentRegistrationConfig, RegisteredComponent, IsolatedModeSession, IsolatedModeDiagnostics } from './lib/shared-components/variant-selector/isolated-mode-integration.service';