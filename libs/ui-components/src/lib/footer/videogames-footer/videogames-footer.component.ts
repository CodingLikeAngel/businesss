import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Link {
  label: string;
  href: string;
  icon?: string;
}

export interface SocialIcon {
  name: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  href: string;
}

export const videogameVariants = [
  'arcade', 'neon-grid', 'pixel-adventure', 'cosmic', 'fantasy-realm',
  'speed-rush', 'blocky-world', 'dark-slayer', 'portal-jump', 'nature-quest',
  'rayman', 'super-mario', 'zelda', 'donkey-kong', 'cyber-2030', 'monet-garden',
  'picasso-cubism', 'cyberpunk-2077', 'retro-wave', 'steampunk', 'ice-kingdom',
  'desert-oasis', 'space-colony', 'underwater-city', 'volcanic-eruption',
  'jungle-expedition', 'time-travel', 'haunted-mansion'
] as const;
export type VideogameVariant = typeof videogameVariants[number];

export interface videoGamesFooterCustomStyles {
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
  templateUrl: './videogames-footer.component.html',
  styleUrls: ['./videogames-footer.component.scss'],
})
export class UIVideogamesFooterComponent {
  @Input() variant = 'arcade';
  @Input() title = 'Your Business';
  @Input() description = 'Impulsa tu éxito con nosotros';
  @Input() exploreLinks: Link[] = [
    { label: 'Servicios', href: '#', icon: '⚙️' },
    { label: 'Productos', href: '#', icon: '🛍️' },
    { label: 'Nosotros', href: '#', icon: '👥' },
    { label: 'Contacto', href: '#', icon: '📞' },
  ];
  @Input() trendLinks: Link[] = [
    { label: 'Blog', href: '#', icon: '📝' },
    { label: 'FAQ', href: '#', icon: '❓' },
    { label: 'Soporte', href: '#', icon: '🛠️' },
  ];
  @Input() socialIcons: SocialIcon[] = [
    { name: 'twitter', href: '#' },
    { name: 'facebook', href: '#' },
    { name: 'instagram', href: '#' },
    { name: 'linkedin', href: '#' },
  ];
  @Input() copyrightText = '© {{currentYear}} Your Business - Todos los derechos reservados';
  @Input() showParticles = true;
  @Input() customStyles: videoGamesFooterCustomStyles = {};

  @Output() linkClicked = new EventEmitter<string>();
  @Output() socialClicked = new EventEmitter<string>();

  currentYear = new Date().getFullYear();

  onLinkClick(href: string) {
    this.linkClicked.emit(href);
  }

  onSocialClick(href: string) {
    this.socialClicked.emit(href);
  }

  get titleClasses(): string[] {
    return ['footer-title', `footer-title--${this.variant}`];
  }

  get footerClasses(): string[] {
    return ['footer', `footer--${this.variant}`, this.showParticles ? 'footer--with-particles' : ''].filter(Boolean);
  }

  getSocialIcon(name: SocialIcon['name']): string {
    const icons: Record<SocialIcon['name'], string> = {
      twitter: '🐦',
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
    };
    return icons[name] || '🌐';
  }

  getSocialIconClass(name: SocialIcon['name']): string {
    return `hud-icon--${name}`;
  }
}
