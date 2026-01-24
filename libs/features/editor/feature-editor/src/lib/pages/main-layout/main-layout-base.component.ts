import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, FooterConfig, HeaderConfig, NavBarConfig, UiStateService, VisualEditorService, PageSection } from '@negocio/shared-components';
import { CardVariant, footerVariants, bubbleVariants, cardRutasVariants, titleVariants, variants } from '@negocio/ui-components';

@Component({
  template: '' // Clase abstracta, no necesita template
})
export abstract class MainLayoutBaseComponent implements OnInit, OnDestroy {
  headerConfig!: HeaderConfig;
  footerConfig!: FooterConfig;
  navBarConfig!: NavBarConfig;
  componentVariants: { [key: string]: string } = {};
  globalVariant = 'default';
  previewMode = false;
  builderStep: 'welcome' | 'editor' | 'preview' = 'welcome';
  previewSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  private navBarConfigSub?: Subscription;
  private variantSub?: Subscription;
  private stepSub?: Subscription;

  protected uiStateService = inject(UiStateService);
  protected visualEditor = inject(VisualEditorService);

  constructor(protected variantService: VariantService, protected router: Router) {

    
    this.headerConfig = this.variantService.getCurrentHeaderConfig();
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.navBarConfig = this.variantService.getCurrentNavBarConfig();

    this.variantSub = this.variantService.componentVariants$.subscribe((variants) => {
      this.componentVariants = { ...variants };
    });

    this.variantService.globalVariant$.subscribe((variant) => {
      this.globalVariant = variant;
    });

    this.stepSub = this.variantService.builderStep$.subscribe((step) => {
      this.builderStep = step;
      this.previewMode = step === 'preview';
    });
  }

  ngOnInit() {
    this.variantService.headerConfig$.subscribe((config) => {
      this.headerConfig = config;
    });
    this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
    });
    this.navBarConfigSub = this.variantService.navBarConfig$.subscribe((config) => {
      this.navBarConfig = config;
    });
  }

  ngOnDestroy() {
    this.navBarConfigSub?.unsubscribe();
    this.variantSub?.unsubscribe();
    this.stepSub?.unsubscribe();
  }

  onLinkClick(href: string) {
    if (href.startsWith('/')) {
      this.router.navigateByUrl(href);
    } else {
      window.open(href, '_blank');
    }
  }

  onSocialClick(href: string) {
    console.log(`Social media clicked: ${href}`);
    window.open(href, '_blank');
  }

  getVariant(componentId: string): any {
    return this.componentVariants[componentId] || this.globalVariant;
  }

  selectElement(event: Event | null, element: any) {
    if (event) {
      event.stopPropagation();
    }
    console.log('Selecting global element:', element);
    this.uiStateService.selectElement(element);
  }

  onWorkspaceClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Only deselect if clicking the workspace background directly or non-editable areas
    if (target.classList.contains('canvas-area') || 
        target.classList.contains('canvas-wrapper') || 
        target.classList.contains('frame-content')) {
      console.log('Deselecting via workspace click');
      this.visualEditor.deselectElement();
      this.uiStateService.selectElement(null);
    }
  }

  setPreviewSize(size: 'mobile' | 'tablet' | 'desktop') {
    this.previewSize = size;
  }

  /**
   * Generates a virtual PageSection object for the global header.
   * This allows using the standard Editor components in the layout shell.
   */
  get headerAsSection(): PageSection {
    return {
      id: 'global_header',
      type: 'header',
      label: 'Cabecera Global',
      visible: true,
      name: 'Global Header',
      styles: this.headerConfig.customStyles as any || {},
      content: {
        title: this.headerConfig.title,
        subtitle: this.headerConfig.subtitle,
        navItems: this.headerConfig.navItems,
        variant: this.headerConfig.variant,
        align: this.headerConfig.align,
        dark: this.headerConfig.dark
      },
      elements: [],
      config: {},
      customStyles: {},
      animation: 'none',
      layout: 'default'
    };
  }

  /**
   * Generates a virtual PageSection object for the global footer.
   */
  get footerAsSection(): PageSection {
    return {
      id: 'global_footer',
      type: 'footer',
      label: 'Pie de Página Global',
      visible: true,
      name: 'Global Footer',
      styles: this.footerConfig.customStyles as any || {},
      content: {
        title: this.footerConfig.title,
        description: this.footerConfig.description,
        variant: this.footerConfig.variant,
        dark: this.footerConfig.dark
      },
      elements: [],
      config: {},
      customStyles: {},
      animation: 'none',
      layout: 'default'
    };
  }

  /**
   * Handles events from the global header editor.
   */
  onGlobalHeaderEvent(bounds: any, elementId: string) {
    const currentConfig = this.headerConfig;
    const currentPage = this.variantService.getCurrentPage();
    if (currentPage) {
        // Log update if needed
    }
    
    // Dispatch update to global header config
    this.variantService.updateHeaderConfig({
      ...currentConfig,
      customStyles: {
        ...(currentConfig.customStyles || {}),
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        transform: `translate(${bounds.x}px, ${bounds.y}px)`
      }
    });
  }

  /**
   * Handles events from the global footer editor.
   */
  onGlobalFooterEvent(bounds: any, elementId: string) {
    const currentConfig = this.footerConfig;
    this.variantService.updateFooterConfig({
      ...currentConfig,
      customStyles: {
        ...(currentConfig.customStyles || {}),
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        transform: `translate(${bounds.x}px, ${bounds.y}px)`
      }
    });
  }
}