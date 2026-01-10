import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, FooterConfig, HeaderConfig, NavBarConfig } from '@negocio/shared-components';
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

  setPreviewSize(size: 'mobile' | 'tablet' | 'desktop') {
    this.previewSize = size;
  }

}