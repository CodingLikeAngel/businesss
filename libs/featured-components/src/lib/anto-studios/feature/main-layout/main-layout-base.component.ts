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

  getVariant(componentId: string): any {
    const variant = this.componentVariants[componentId] || this.globalVariant;
    const validVariants = [
      'default', 'primary', 'secondary', 'outline', 'ghost', 'link', 'neon', 'cyberpunk', 'gradient', 'glass',
      'retro', 'pulse-gradient', 'holo', 'matrix', 'quantum', 'cybernetic', 'danger', 'success', 'nano',
      'stellar', 'phoenix', 'galactic', 'orbitron', 'cartoon', 'luma', 'platform', 'hero', 'coin', 'cloud',
      'fire', 'water', 'leaf', 'amber-glow', 'minimal-white', 'mario', 'zelda', 'kirby', 'rayman', 'lum',
      'river', 'minimal', 'hex-teal', 'purple-edge', 'rose-radial', 'yellow-pulse', 'green-inset', 'blue-skew',
      'orange-dash', 'indigo-dots', 'bubble', 'electoon', 'jungle', 'joycon', 'neomorph', 'glitch', 'portal',
      'bioshock', 'super-meat-boy', 'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs',
      'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite', 'ice', 'metal', 'energy', 'void',
      'cosmic', 'plasma', 'arcade', 'pixel', 'chaos', 'vortex', 'stone', 'donkeykong', 'supermeatboy', 'aqua',
      'vaporwave', 'aurora', 'trailblazer', 'elegant', 'vintage', 'luxury', 'rockstar', 'ubisoft', 'morphing-blob',
      'liquid-metal', 'crystal-prism', 'neural-network', 'quantum-field', 'holographic-matrix', 'plasma-storm',
      'cyber-circuit', 'organic-growth', 'fractal-dimension', 'time-warp', 'dimensional-shift', 'nano-swarm',
      'energy-web', 'void-portal', 'cosmic-dust', 'stellar-nova', 'aurora-borealis', 'lava-flow', 'ice-crystal',
      'thunder-storm', 'water-ripple', 'black-hole', 'wormhole', 'dna-helix', 'crystal', 'gear', 'star', 'hexagon'
    ];
    return validVariants.includes(variant) ? variant : 'default';
  }

  abstract scrollToSection(section: string): void; // Método abstracto para que las hijas lo implementen
}