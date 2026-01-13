import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariantService, FooterConfig, HeaderConfig, NavBarConfig } from '@negocio/shared-components';
import { CardVariant } from '@negocio/ui-components';

@Component({
  template: '' // Clase abstracta, no necesita template
})
export abstract class MainLayoutBaseComponent implements OnInit, OnDestroy {
  headerConfig!: HeaderConfig;
  footerConfig!: FooterConfig;
  navBarConfig!: NavBarConfig;
  componentVariants: { [key: string]: string } = {};
  globalVariant = 'default';
  private navBarConfigSub?: Subscription;
  private variantSub?: Subscription;

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

  getVariant(componentId: string): CardVariant {
    const variant = this.componentVariants[componentId] || this.globalVariant;
    const validVariants = [
      'default', 'cyberpunk', 'jungle', 'enchanted', 'mystic', 'ancient', 'twilight',
      'frosty', 'desert', 'candy', 'oceanic', 'fiery', 'primary', 'secondary', 'neon',
      'matrix', 'stellar', 'retro', 'phoenix', 'aqua', 'plasma', 'cosmic', 'vaporwave',
      'aurora', 'trailblazer', 'arcade', 'outline', 'ghost', 'link', 'gradient', 'glass',
      'pulse-gradient', 'holo', 'quantum', 'cybernetic', 'danger', 'success', 'nano',
      'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud',
      'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'hex-teal', 'purple-edge',
      'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew', 'orange-dash',
      'indigo-dots', 'bubble', 'electoon', 'joycon', 'neomorph', 'glitch', 'portal',
    ];
    return validVariants.includes(variant) ? (variant as CardVariant) : 'default';
  }

  abstract scrollToSection(section: string): void; // Método abstracto para que las hijas lo implementen
}