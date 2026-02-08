// Core Services
export * from './services/variant-rotation.service';
export * from './services/device-resolver.service';
export * from './services/variant.service';
export * from './services/template.service';
export * from './guards/device.guard';
export * from './services/loading-service.service';
export * from './services/ai.service';

// Core Components (Public API)
export * from './lib/shared-components/chat-component/chat-component.component';
export * from './lib/shared-components/template-selector/template-selector.component';
export * from './lib/shared-components/variant-selector/variant-selector.component';
export * from './lib/shared-components/variant-selector/isolated-mode-integration.service';
export * from './lib/shared-components/variant-selector/isolated-mode-trigger.component';

// Interfaces & Constants
export { SimpleVisualEditorService, SimpleEditableElement, DragState, ResizeState } from './services/simple-visual-editor.service';
export { VisualEditingConfig, VisualEditingEvent, DEFAULT_CONFIGS, PlatformInfo, IsolatedModeConfig, IsolatedModeEvent, IsolatedModeEventType, PreviewConfig, ControlPanelConfig, ControlSection, ControlDefinition } from './lib/shared-components/variant-selector/enhanced-visual-editing.interfaces';
export { IsolatedModeComponentType, ComponentRegistrationConfig, RegisteredComponent, IsolatedModeSession, IsolatedModeDiagnostics } from './lib/shared-components/variant-selector/isolated-mode-integration.service';

// Services
export * from './lib/shared-components/variant-selector/ui-state.service';
export * from './lib/shared-components/variant-selector/visual-editor.service';
export * from './lib/shared-components/variant-selector/variant-registry';
export * from './lib/shared-components/variant-selector/unified-styling.service';

// Export System (Multi-framework)
export * from './lib/services/export/index';

// Component Export System