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
  getRegisteredComponentsByType<T = object>(componentType: IsolatedModeComponentType): T[] {
    const components: T[] = [];
    this._registeredComponents().forEach((registration) => {
      if (registration.type === componentType) {
        components.push(registration.instance as T);
      }
    });
    return components;
  }

  // =========================================================================
  // Isolated Mode Sessions
  // =========================================================================

  /**
   * Open an isolated mode editing session for a component
   */
  openIsolatedMode(
    componentId: string,
    modeType: IsolatedModeComponentType,
    initialConfig?: Partial<IsolatedModeConfig>
  ): IsolatedModeSession | null {
    const registration = this._registeredComponents().get(componentId);
    
    if (!registration) {
      console.warn(`[IsolatedModeIntegrationService] Component not found: ${componentId}`);
      return null;
    }

    if (!registration.isEditable) {
      console.warn(`[IsolatedModeIntegrationService] Component is not editable: ${componentId}`);
      return null;
    }

    // Extract current content from component instance
    const currentContent = this.extractComponentContent(registration.instance, modeType);

    // Create session config matching IsolatedModeConfig interface
    const sessionConfig: IsolatedModeConfig = {
      id: `isolated-${Date.now()}`,
      componentType: modeType,
      content: {
        ...registration.defaultConfig,
        ...currentContent,
        ...initialConfig?.content
      },
      styles: {},
      variants: registration.supportedVariants,
      metadata: {
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        modifiedBy: 'user'
      }
    };

    // Create session
    const session: IsolatedModeSession = {
      id: this.generateSessionId(),
      componentId,
      modeType,
      config: sessionConfig,
      status: 'active',
      startedAt: Date.now()
    };

    // Set as active session
    this._activeSession.set(session);

    // Emit event using proper IsolatedModeEvent structure
    this._sessionEvents.next({
      type: 'opened',
      config: sessionConfig,
      timestamp: Date.now()
    });

    console.log(`[IsolatedModeIntegrationService] Opened isolated mode session: ${session.id}`);

    return session;
  }

  /**
   * Close the current isolated mode session
   */
  closeIsolatedMode(applyChanges: boolean = false): void {
    const session = this._activeSession();
    
    if (!session) {
      return;
    }

    const eventType: IsolatedModeEventType = applyChanges ? 'applied' : 'cancelled';
    
    // Emit event using proper IsolatedModeEvent structure
    this._sessionEvents.next({
      type: eventType,
      config: session.config,
      timestamp: Date.now()
    });

    // Clear session
    this._activeSession.set(null);
    this._pendingChanges.set(new Map());

    console.log(`[IsolatedModeIntegrationService] Closed isolated mode session: ${session.id} (apply: ${applyChanges})`);
  }

  /**
   * Apply changes from isolated mode to the registered component
   */
  applyChangesToComponent(componentId: string, changes: object): void {
    const registration = this._registeredComponents().get(componentId);
    
    if (!registration) {
      console.warn(`[IsolatedModeIntegrationService] Component not found: ${componentId}`);
      return;
    }

    // Apply changes to component instance
    this.applyComponentContent(registration.instance, registration.type, changes);

    // Track pending changes
    this._pendingChanges.update(pending => {
      const newMap = new Map(pending);
      newMap.set(componentId, changes);
      return newMap;
    });

    // Emit update event
    this._componentUpdates.next({ componentId, changes });

    console.log(`[IsolatedModeIntegrationService] Applied changes to component: ${componentId}`);
  }

  // =========================================================================
  // Component Content Mapping
  // =========================================================================

  /**
   * Extract content from a component instance based on its type
   */
  private extractComponentContent(instance: object, componentType: IsolatedModeComponentType): object {
    // Type-safe extraction based on component type
    switch (componentType) {
      case 'hero':
        return this.extractHeroContent(instance);
      case 'features':
        return this.extractFeaturesContent(instance);
      case 'testimonials':
        return this.extractTestimonialsContent(instance);
      case 'pricing':
        return this.extractPricingContent(instance);
      case 'gallery':
        return this.extractGalleryContent(instance);
      case 'contact':
        return this.extractContactContent(instance);
      case 'cta':
        return this.extractCtaContent(instance);
      case 'stats':
        return this.extractStatsContent(instance);
      case 'products':
        return this.extractProductsContent(instance);
      case 'newsletter':
        return this.extractNewsletterContent(instance);
      case 'faq':
        return this.extractFaqContent(instance);
      case 'steps':
        return this.extractStepsContent(instance);
      case 'reservation':
        return this.extractReservationContent(instance);
      case 'promotions':
        return this.extractPromotionsContent(instance);
      default:
        return this.extractGenericContent(instance);
    }
  }

  /**
   * Apply content changes to a component instance
   */
  private applyComponentContent(instance: object, componentType: IsolatedModeComponentType, changes: object): void {
    switch (componentType) {
      case 'hero':
        this.applyHeroContent(instance, changes);
        break;
      case 'features':
        this.applyFeaturesContent(instance, changes);
        break;
      case 'testimonials':
        this.applyTestimonialsContent(instance, changes);
        break;
      case 'pricing':
        this.applyPricingContent(instance, changes);
        break;
      case 'gallery':
        this.applyGalleryContent(instance, changes);
        break;
      case 'contact':
        this.applyContactContent(instance, changes);
        break;
      case 'cta':
        this.applyCtaContent(instance, changes);
        break;
      case 'stats':
        this.applyStatsContent(instance, changes);
        break;
      case 'products':
        this.applyProductsContent(instance, changes);
        break;
      case 'newsletter':
        this.applyNewsletterContent(instance, changes);
        break;
      case 'faq':
        this.applyFaqContent(instance, changes);
        break;
      case 'steps':
        this.applyStepsContent(instance, changes);
        break;
      case 'reservation':
        this.applyReservationContent(instance, changes);
        break;
      case 'promotions':
        this.applyPromotionsContent(instance, changes);
        break;
      default:
        this.applyGenericContent(instance, changes);
    }
  }

  // =========================================================================
  // Content Extraction Methods
  // =========================================================================

  private extractHeroContent(instance: object): object {
    const hero = instance as any;
    return {
      title: hero.title?.() ?? hero.title ?? 'Hero Section',
      subtitle: hero.subtitle?.() ?? hero.subtitle ?? 'Welcome to our business',
      variant: hero.variant?.() ?? hero.variant ?? 'default',
      backgroundColor: hero.customStyles?.()?.['backgroundColor'] ?? '#1a1a2e',
      textColor: hero.customStyles?.()?.['color'] ?? '#ffffff',
      buttonColor: hero.buttonColor?.() ?? hero.buttonColor ?? '#6366f1'
    };
  }

  private extractFeaturesContent(instance: object): object {
    const features = instance as any;
    return {
      title: features.title?.() ?? features.title ?? 'Our Features',
      subtitle: features.subtitle?.() ?? features.subtitle ?? 'What we offer',
      items: features.items?.() ?? features.items ?? [],
      variant: features.variant?.() ?? features.variant ?? 'default',
      backgroundColor: features.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: features.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractTestimonialsContent(instance: object): object {
    const testimonials = instance as any;
    return {
      title: testimonials.title?.() ?? testimonials.title ?? 'Testimonials',
      subtitle: testimonials.subtitle?.() ?? testimonials.subtitle ?? 'What our clients say',
      items: testimonials.items?.() ?? testimonials.items ?? [],
      variant: testimonials.variant?.() ?? testimonials.variant ?? 'default',
      backgroundColor: testimonials.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: testimonials.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractPricingContent(instance: object): object {
    const pricing = instance as any;
    return {
      title: pricing.title?.() ?? pricing.title ?? 'Pricing Plans',
      subtitle: pricing.subtitle?.() ?? pricing.subtitle ?? 'Choose your plan',
      plans: pricing.plans?.() ?? pricing.plans ?? [],
      variant: pricing.variant?.() ?? pricing.variant ?? 'default',
      backgroundColor: pricing.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: pricing.customStyles?.()?.['color'] ?? '#ffffff',
      accentColor: pricing.accentColor?.() ?? pricing.accentColor ?? '#6366f1'
    };
  }

  private extractGalleryContent(instance: object): object {
    const gallery = instance as any;
    return {
      title: gallery.title?.() ?? gallery.title ?? 'Gallery',
      subtitle: gallery.subtitle?.() ?? gallery.subtitle ?? 'Our work',
      images: gallery.images?.() ?? gallery.images ?? [],
      variant: gallery.variant?.() ?? gallery.variant ?? 'default',
      backgroundColor: gallery.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: gallery.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractContactContent(instance: object): object {
    const contact = instance as any;
    return {
      title: contact.title?.() ?? contact.title ?? 'Contact Us',
      subtitle: contact.subtitle?.() ?? contact.subtitle ?? 'Get in touch',
      email: contact.email?.() ?? contact.email ?? '',
      phone: contact.phone?.() ?? contact.phone ?? '',
      address: contact.address?.() ?? contact.address ?? '',
      variant: contact.variant?.() ?? contact.variant ?? 'default',
      backgroundColor: contact.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: contact.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractCtaContent(instance: object): object {
    const cta = instance as any;
    return {
      title: cta.title?.() ?? cta.title ?? 'Ready to Get Started?',
      subtitle: cta.subtitle?.() ?? cta.subtitle ?? 'Join us today',
      buttonText: cta.buttonText?.() ?? cta.buttonText ?? 'Sign Up Now',
      buttonUrl: cta.buttonUrl?.() ?? cta.buttonUrl ?? '#',
      variant: cta.variant?.() ?? cta.variant ?? 'default',
      backgroundColor: cta.customStyles?.()?.['backgroundColor'] ?? '#6366f1',
      textColor: cta.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractStatsContent(instance: object): object {
    const stats = instance as any;
    return {
      title: stats.title?.() ?? stats.title ?? 'Our Stats',
      subtitle: stats.subtitle?.() ?? stats.subtitle ?? 'Numbers speak',
      stats: stats.stats?.() ?? stats.stats ?? [],
      variant: stats.variant?.() ?? stats.variant ?? 'default',
      backgroundColor: stats.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: stats.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractProductsContent(instance: object): object {
    const products = instance as any;
    return {
      title: products.title?.() ?? products.title ?? 'Our Products',
      subtitle: products.subtitle?.() ?? products.subtitle ?? 'Browse our catalog',
      products: products.products?.() ?? products.products ?? [],
      variant: products.variant?.() ?? products.variant ?? 'default',
      backgroundColor: products.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: products.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractNewsletterContent(instance: object): object {
    const newsletter = instance as any;
    return {
      title: newsletter.title?.() ?? newsletter.title ?? 'Subscribe to Our Newsletter',
      subtitle: newsletter.subtitle?.() ?? newsletter.subtitle ?? 'Stay updated',
      buttonText: newsletter.buttonText?.() ?? newsletter.buttonText ?? 'Subscribe',
      placeholder: newsletter.placeholder?.() ?? newsletter.placeholder ?? 'Enter your email',
      variant: newsletter.variant?.() ?? newsletter.variant ?? 'default',
      backgroundColor: newsletter.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: newsletter.customStyles?.()?.['color'] ?? '#ffffff',
      buttonColor: newsletter.buttonColor?.() ?? newsletter.buttonColor ?? '#6366f1'
    };
  }

  private extractFaqContent(instance: object): object {
    const faq = instance as any;
    return {
      title: faq.title?.() ?? faq.title ?? 'Frequently Asked Questions',
      subtitle: faq.subtitle?.() ?? faq.subtitle ?? 'Got questions?',
      items: faq.items?.() ?? faq.items ?? [],
      variant: faq.variant?.() ?? faq.variant ?? 'default',
      backgroundColor: faq.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: faq.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractStepsContent(instance: object): object {
    const steps = instance as any;
    return {
      title: steps.title?.() ?? steps.title ?? 'How It Works',
      subtitle: steps.subtitle?.() ?? steps.subtitle ?? 'Simple steps',
      steps: steps.steps?.() ?? steps.steps ?? [],
      variant: steps.variant?.() ?? steps.variant ?? 'default',
      backgroundColor: steps.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: steps.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  private extractReservationContent(instance: object): object {
    const reservation = instance as any;
    return {
      title: reservation.title?.() ?? reservation.title ?? 'Book an Appointment',
      subtitle: reservation.subtitle?.() ?? reservation.subtitle ?? 'Schedule your visit',
      variant: reservation.variant?.() ?? reservation.variant ?? 'default',
      backgroundColor: reservation.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: reservation.customStyles?.()?.['color'] ?? '#ffffff',
      buttonColor: reservation.buttonColor?.() ?? reservation.buttonColor ?? '#6366f1'
    };
  }

  private extractPromotionsContent(instance: object): object {
    const promotions = instance as any;
    return {
      title: promotions.title?.() ?? promotions.title ?? 'Special Offers',
      subtitle: promotions.subtitle?.() ?? promotions.subtitle ?? 'Check out our deals',
      promotions: promotions.items?.() ?? promotions.items ?? [],
      variant: promotions.variant?.() ?? promotions.variant ?? 'default',
      backgroundColor: promotions.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: promotions.customStyles?.()?.['color'] ?? '#ffffff',
      buttonColor: promotions.buttonColor?.() ?? promotions.buttonColor ?? '#6366f1'
    };
  }

  private extractGenericContent(instance: object): object {
    const generic = instance as any;
    // Try common patterns
    return {
      title: generic.title?.() ?? generic.title,
      subtitle: generic.subtitle?.() ?? generic.subtitle,
      variant: generic.variant?.() ?? generic.variant,
      backgroundColor: generic.customStyles?.()?.['backgroundColor'] ?? '#0f172a',
      textColor: generic.customStyles?.()?.['color'] ?? '#ffffff'
    };
  }

  // =========================================================================
  // Content Application Methods
  // =========================================================================

  private applyHeroContent(instance: object, changes: object): void {
    const hero = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && hero.title?.set) hero.title.set(content.title);
    if (content.subtitle !== undefined && hero.subtitle?.set) hero.subtitle.set(content.subtitle);
    if (content.variant !== undefined && hero.variant?.set) hero.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied hero content changes');
  }

  private applyFeaturesContent(instance: object, changes: object): void {
    const features = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && features.title?.set) features.title.set(content.title);
    if (content.subtitle !== undefined && features.subtitle?.set) features.subtitle.set(content.subtitle);
    if (content.items !== undefined && features.items?.set) features.items.set(content.items);
    if (content.variant !== undefined && features.variant?.set) features.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied features content changes');
  }

  private applyTestimonialsContent(instance: object, changes: object): void {
    const testimonials = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && testimonials.title?.set) testimonials.title.set(content.title);
    if (content.items !== undefined && testimonials.items?.set) testimonials.items.set(content.items);
    if (content.variant !== undefined && testimonials.variant?.set) testimonials.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied testimonials content changes');
  }

  private applyPricingContent(instance: object, changes: object): void {
    const pricing = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && pricing.title?.set) pricing.title.set(content.title);
    if (content.plans !== undefined && pricing.plans?.set) pricing.plans.set(content.plans);
    if (content.variant !== undefined && pricing.variant?.set) pricing.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied pricing content changes');
  }

  private applyGalleryContent(instance: object, changes: object): void {
    const gallery = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && gallery.title?.set) gallery.title.set(content.title);
    if (content.images !== undefined && gallery.images?.set) gallery.images.set(content.images);
    if (content.variant !== undefined && gallery.variant?.set) gallery.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied gallery content changes');
  }

  private applyContactContent(instance: object, changes: object): void {
    const contact = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && contact.title?.set) contact.title.set(content.title);
    if (content.email !== undefined && contact.email?.set) contact.email.set(content.email);
    if (content.phone !== undefined && contact.phone?.set) contact.phone.set(content.phone);
    if (content.variant !== undefined && contact.variant?.set) contact.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied contact content changes');
  }

  private applyCtaContent(instance: object, changes: object): void {
    const cta = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && cta.title?.set) cta.title.set(content.title);
    if (content.subtitle !== undefined && cta.subtitle?.set) cta.subtitle.set(content.subtitle);
    if (content.buttonText !== undefined && cta.buttonText?.set) cta.buttonText.set(content.buttonText);
    if (content.variant !== undefined && cta.variant?.set) cta.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied CTA content changes');
  }

  private applyStatsContent(instance: object, changes: object): void {
    const stats = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && stats.title?.set) stats.title.set(content.title);
    if (content.stats !== undefined && stats.stats?.set) stats.stats.set(content.stats);
    if (content.variant !== undefined && stats.variant?.set) stats.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied stats content changes');
  }

  private applyProductsContent(instance: object, changes: object): void {
    const products = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && products.title?.set) products.title.set(content.title);
    if (content.products !== undefined && products.products?.set) products.products.set(content.products);
    if (content.variant !== undefined && products.variant?.set) products.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied products content changes');
  }

  private applyNewsletterContent(instance: object, changes: object): void {
    const newsletter = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && newsletter.title?.set) newsletter.title.set(content.title);
    if (content.subtitle !== undefined && newsletter.subtitle?.set) newsletter.subtitle.set(content.subtitle);
    if (content.buttonText !== undefined && newsletter.buttonText?.set) newsletter.buttonText.set(content.buttonText);
    if (content.variant !== undefined && newsletter.variant?.set) newsletter.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied newsletter content changes');
  }

  private applyFaqContent(instance: object, changes: object): void {
    const faq = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && faq.title?.set) faq.title.set(content.title);
    if (content.items !== undefined && faq.items?.set) faq.items.set(content.items);
    if (content.variant !== undefined && faq.variant?.set) faq.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied FAQ content changes');
  }

  private applyStepsContent(instance: object, changes: object): void {
    const steps = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && steps.title?.set) steps.title.set(content.title);
    if (content.steps !== undefined && steps.steps?.set) steps.steps.set(content.steps);
    if (content.variant !== undefined && steps.variant?.set) steps.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied steps content changes');
  }

  private applyReservationContent(instance: object, changes: object): void {
    const reservation = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && reservation.title?.set) reservation.title.set(content.title);
    if (content.subtitle !== undefined && reservation.subtitle?.set) reservation.subtitle.set(content.subtitle);
    if (content.variant !== undefined && reservation.variant?.set) reservation.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied reservation content changes');
  }

  private applyPromotionsContent(instance: object, changes: object): void {
    const promotions = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && promotions.title?.set) promotions.title.set(content.title);
    if (content.subtitle !== undefined && promotions.subtitle?.set) promotions.subtitle.set(content.subtitle);
    if (content.promotions !== undefined && promotions.items?.set) promotions.items.set(content.promotions);
    if (content.variant !== undefined && promotions.variant?.set) promotions.variant.set(content.variant);
    
    console.log('[IsolatedModeIntegrationService] Applied promotions content changes');
  }

  private applyGenericContent(instance: object, changes: object): void {
    const generic = instance as any;
    const content = changes as any;
    
    if (content.title !== undefined && generic.title?.set) generic.title.set(content.title);
    if (content.subtitle !== undefined && generic.subtitle?.set) generic.subtitle.set(content.subtitle);
    
    console.log('[IsolatedModeIntegrationService] Applied generic content changes');
  }

  // =========================================================================
  // Utility Methods
  // =========================================================================

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all registered components
   */
  clearAllRegistrations(): void {
    this._registeredComponents.set(new Map());
    this._activeSession.set(null);
    this._pendingChanges.set(new Map());
    console.log('[IsolatedModeIntegrationService] Cleared all registrations');
  }

  /**
   * Get diagnostic information about the service state
   */
  getDiagnostics(): IsolatedModeDiagnostics {
    return {
      activeSession: this._activeSession(),
      registeredComponentsCount: this._registeredComponents().size,
      pendingChangesCount: this._pendingChanges().size,
      timestamp: Date.now()
    };
  }
}

// =========================================================================
// Types and Interfaces
// =========================================================================

/**
 * Supported isolated mode component types
 */
export type IsolatedModeComponentType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'gallery'
  | 'contact'
  | 'cta'
  | 'stats'
  | 'products'
  | 'newsletter'
  | 'faq'
  | 'steps'
  | 'reservation'
  | 'promotions';

/**
 * Component registration configuration
 */
export interface ComponentRegistrationConfig {
  isEditable: boolean;
  supportedVariants: string[];
  defaultConfig: object;
}

/**
 * Registered component information
 */
export interface RegisteredComponent {
  id: string;
  type: IsolatedModeComponentType;
  instance: object;
  isEditable: boolean;
  supportedVariants: string[];
  defaultConfig: object;
}

/**
 * Isolated mode session information
 */
export interface IsolatedModeSession {
  id: string;
  componentId: string;
  modeType: IsolatedModeComponentType;
  config: IsolatedModeConfig;
  status: 'active' | 'closed' | 'applied';
  startedAt: number;
  endedAt?: number;
}

/**
 * Diagnostic information about the service
 */
export interface IsolatedModeDiagnostics {
  activeSession: IsolatedModeSession | null;
  registeredComponentsCount: number;
  pendingChangesCount: number;
  timestamp: number;
}
