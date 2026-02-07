import { Injectable, signal, computed } from '@angular/core';
import { IsolatedModeConfig, IsolatedModeEvent, IsolatedModeEventType } from './enhanced-visual-editing.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Isolated Mode Integration Service
 * 
 * This service connects isolated mode editors with actual featured components,
 * providing seamless integration between the visual editor and the component instances.
 * 
 * Features:
 * - Register component instances for live editing
 * - Track active editing sessions
 * - Apply isolated mode changes back to components
 * - Coordinate multiple component updates
 */
@Injectable({
  providedIn: 'root'
})
export class IsolatedModeIntegrationService {
  
  // Signal-based state for reactive updates
  private _activeSession = signal<IsolatedModeSession | null>(null);
  private _registeredComponents = signal<Map<string, RegisteredComponent>>(new Map());
  private _pendingChanges = signal<Map<string, object>>(new Map());
  
  // Computed values
  readonly activeSession = computed(() => this._activeSession());
  readonly hasActiveSession = computed(() => this._activeSession() !== null);
  readonly registeredComponentCount = computed(() => this._registeredComponents().size);
  
  // Observable streams for external subscriptions
  private _sessionEvents = new BehaviorSubject<IsolatedModeEvent | null>(null);
  private _componentUpdates = new BehaviorSubject<{ componentId: string; changes: object } | null>(null);
  
  readonly sessionEvents$: Observable<IsolatedModeEvent | null> = this._sessionEvents.asObservable();
  readonly componentUpdates$: Observable<{ componentId: string; changes: object } | null> = this._componentUpdates.asObservable();

  constructor() {
    console.log('[IsolatedModeIntegrationService] Initialized');
  }

  // =========================================================================
  // Component Registration
  // =========================================================================

  /**
   * Register a component instance for isolated mode editing
   */
  registerComponent(
    componentId: string,
    componentType: IsolatedModeComponentType,
    instance: object,
    config?: Partial<ComponentRegistrationConfig>
  ): void {
    const registration: RegisteredComponent = {
      id: componentId,
      type: componentType,
      instance: instance,
      isEditable: config?.isEditable ?? true,
      supportedVariants: config?.supportedVariants ?? ['default'],
      defaultConfig: config?.defaultConfig ?? {}
    };

    this._registeredComponents.update(components => {
      const newMap = new Map(components);
      newMap.set(componentId, registration);
      return newMap;
    });

    console.log(`[IsolatedModeIntegrationService] Registered component: ${componentId} (${componentType})`);
  }

  /**
   * Unregister a component instance
   */
  unregisterComponent(componentId: string): void {
    this._registeredComponents.update(components => {
      const newMap = new Map(components);
      newMap.delete(componentId);
      return newMap;
    });

    console.log(`[IsolatedModeIntegrationService] Unregistered component: ${componentId}`);
  }

  /**
   * Get a registered component instance
   */
  getRegisteredComponent<T = object>(componentId: string): T | null {
    const component = this._registeredComponents().get(componentId);
    return component ? component.instance as T : null;
  }

  /**
   * Get all registered components of a specific type
   */
