import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, FooterConfig, HeaderConfig, NavBarConfig, UiStateService, VisualEditorService, PageSection } from '@negocio/shared-components';

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

  // Cached virtual sections to ensure stable references for editor components
  private _headerAsSection: PageSection | null = null;
  private _footerAsSection: PageSection | null = null;

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
      if (this._headerAsSection) {
        this._headerAsSection.styles = config.customStyles as any || {};
        this._headerAsSection.content = {
          title: config.title,
          subtitle: config.subtitle,
          navItems: config.navItems,
          variant: config.variant,
          align: config.align,
          dark: config.dark
        };
      }
    });
    this.variantService.footerConfig$.subscribe((config) => {
      this.footerConfig = config;
      if (this._footerAsSection) {
        this._footerAsSection.styles = config.customStyles as any || {};
        this._footerAsSection.content = {
          title: config.title,
          description: config.description,
          variant: config.variant,
          dark: config.dark
        };
      }
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
    window.open(href, '_blank');
  }

  getVariant(componentId: string): any {
    return this.componentVariants[componentId] || this.globalVariant;
  }

  selectElement(event: Event | null, element: any) {
    if (event) {
      event.stopPropagation();
    }
    this.uiStateService.selectElement(element);
  }

  onWorkspaceClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('canvas-area') || 
        target.classList.contains('canvas-wrapper') || 
        target.classList.contains('frame-content')) {
      this.visualEditor.deselectElement();
      this.uiStateService.selectElement(null);
      this.uiStateService.selectSection(null);
    }
  }

  setPreviewSize(size: 'mobile' | 'tablet' | 'desktop') {
    this.previewSize = size;
  }

  /**
   * Returns a cached PageSection view of the global header.
   */
  get headerAsSection(): PageSection {
    if (!this._headerAsSection) {
      this._headerAsSection = {
        id: 'global_header',
        type: 'header',
        label: 'Cabecera Global',
        visible: true,
        isGlobal: true,
        name: 'Global Header',
        styles: this.headerConfig.customStyles as any || {},
        content: this.headerConfig as any,
        elements: [
          {
            id: 'global_header_header',
            type: 'header',
            content: this.headerConfig,
            styles: this.headerConfig.customStyles || {}
          }
        ],
        config: {},
        customStyles: {},
        animation: 'none',
        layout: 'default'
      };
    } else {
      this._headerAsSection.content = this.headerConfig as any;
      this._headerAsSection.styles = this.headerConfig.customStyles as any || {};
      if (this._headerAsSection.elements?.[0]) {
        this._headerAsSection.elements[0].content = this.headerConfig;
        this._headerAsSection.elements[0].styles = this.headerConfig.customStyles || {};
      }
    }
    return this._headerAsSection;
  }

  /**
   * Returns a cached PageSection view of the global footer.
   */
  get footerAsSection(): PageSection {
    if (!this._footerAsSection) {
      this._footerAsSection = {
        id: 'global_footer',
        type: 'footer',
        label: 'Pie de Página Global',
        visible: true,
        isGlobal: true,
        name: 'Global Footer',
        styles: this.footerConfig.customStyles as any || {},
        content: this.footerConfig as any,
        elements: [
          {
            id: 'global_footer_footer',
            type: 'footer',
            content: this.footerConfig,
            styles: this.footerConfig.customStyles || {}
          }
        ],
        config: {},
        customStyles: {},
        animation: 'none',
        layout: 'default'
      };
    } else {
      this._footerAsSection.content = this.footerConfig as any;
      this._footerAsSection.styles = this.footerConfig.customStyles as any || {};
      if (this._footerAsSection.elements?.[0]) {
        this._footerAsSection.elements[0].content = this.footerConfig;
        this._footerAsSection.elements[0].styles = this.footerConfig.customStyles || {};
      }
    }
    return this._footerAsSection;
  }

  onGlobalHeaderEvent(bounds: any, elementId: string) {
    const currentConfig = this.headerConfig;
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

  returnToEditor() {
    this.variantService.setBuilderStep('editor');
  }

  callNow() {
    console.log('Publishing...');
  }

  onTabSelected(tab: any) {
    if (tab && tab.id) {
      this.onLinkClick(tab.id);
    }
  }
}