import { Component, input, output, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

interface Link {
  label: string;
  href: string;
  icon?: string;
}

interface SocialIcon {
  name: 'twitter' | 'facebook' | 'instagram';
  href: string;
}

export const footerVariants = [
  ...baseVariants,
  'ice',
  'metal',
  'energy',
  'void',
  'cosmic',
  'plasma',
  'arcade',
  'pixel',
  'chaos',
  'vortex',
  'stone',
  'mario',
  'zelda',
  'donkeykong',
  'rayman',
  'supermeatboy',
  'bioshock',
];
export type FooterVariant = typeof footerVariants[number];

export interface FooterCustomStyles {
  '--footer-bg'?: string;
  '--footer-color'?: string;
  '--footer-border'?: string;
  '--footer-shadow'?: string;
  '--footer-hover-bg'?: string;
  '--footer-hover-shadow'?: string;
}

@Component({
  selector: 'lib-ui-components-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class UIFooterComponent implements OnInit {
  dark = input(false);
  showParticles = input(true);
  variant = input('primary');
  title = input('Outdoor Haven');
  description = input('Todo lo que necesitas para tus aventuras al aire libre');
  exploreLinks = input<Link[]>([
    { label: 'Pesca', href: '#', icon: '🎣' },
    { label: 'Caza', href: '#', icon: '🏹' },
    { label: 'Senderismo', href: '#', icon: '🏔️' },
    { label: 'Comida', href: '#', icon: '🍖' },
  ]);
  trendLinks = input<Link[]>([
    { label: 'Ayuda', href: '#', icon: '❓' },
    { label: 'Devoluciones', href: '#', icon: '🔄' },
    { label: 'Contacto', href: '#', icon: '✉️' },
  ]);
  socialIcons = input<SocialIcon[]>([
    { name: 'twitter', href: '#' },
    { name: 'facebook', href: '#' },
    { name: 'instagram', href: '#' },
  ]);
  copyrightText = input('© {{currentYear}} Outdoor Haven - Equípate para la naturaleza');
  customStyles = input<FooterCustomStyles>({});

  linkClicked = output<string>();
  socialClicked = output<string>();
  darkChange = output<boolean>();
  showParticlesChange = output<boolean>();

  currentYear = new Date().getFullYear();

  ngOnInit() {
    console.log('Custom Styles:', this.customStyles());
  }

  onLinkClick(href: string) {
    this.linkClicked.emit(href);
  }

  onSocialClick(href: string) {
    this.socialClicked.emit(href);
  }

  titleClasses = computed(() => ['footer-title', `footer-title--${this.variant()}`]);
  
  footerStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });

  footerClasses = computed(() => {
    const isCustomVariant = this.variant().startsWith('custom-footer');
    return [
      'footer',
      isCustomVariant ? 'footer--custom' : `variant-${this.variant()}`,
      this.dark() ? 'dark' : '',
      this.showParticles() ? 'footer--with-particles' : 'footer--no-particles',
    ].filter(Boolean);
  });
}
