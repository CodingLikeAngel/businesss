import { Component, input, output, computed } from '@angular/core';
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
  backgroundColor?: string;
  color?: string;
  '--footer-bg'?: string;
  '--footer-color'?: string;
  '--footer-border'?: string;
  '--footer-shadow'?: string;
  '--footer-hover-bg'?: string;
  '--footer-hover-shadow'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-videogames-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videogames-footer.component.html',
  styleUrl: './videogames-footer.component.scss',
})
export class UIVideogamesFooterComponent {
  variant = input<string>('arcade');
  title = input<string>('Your Business');
  description = input<string>('Impulsa tu éxito con nosotros');
  exploreLinks = input<Link[]>([
    { label: 'Servicios', href: '#', icon: '⚙️' },
    { label: 'Productos', href: '#', icon: '🛍️' },
    { label: 'Nosotros', href: '#', icon: '👥' },
    { label: 'Contacto', href: '#', icon: '📞' },
  ]);
  trendLinks = input<Link[]>([
    { label: 'Blog', href: '#', icon: '📝' },
    { label: 'FAQ', href: '#', icon: '❓' },
    { label: 'Soporte', href: '#', icon: '🛠️' },
  ]);
  socialIcons = input<SocialIcon[]>([
    { name: 'twitter', href: '#' },
    { name: 'facebook', href: '#' },
    { name: 'instagram', href: '#' },
    { name: 'linkedin', href: '#' },
  ]);
  copyrightText = input<string>('© {{currentYear}} Your Business - Todos los derechos reservados');
  showParticles = input<boolean>(true);
  customStyles = input<videoGamesFooterCustomStyles>({});

  videogamesFooterStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--footer-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--footer-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  linkClicked = output<string>();
  socialClicked = output<string>();

  currentYear = new Date().getFullYear();

  onLinkClick(href: string) {
    this.linkClicked.emit(href);
  }

  onSocialClick(href: string) {
    this.socialClicked.emit(href);
  }

  titleClasses = computed(() => ['footer-title', `footer-title--${this.variant()}`]);

  footerClasses = computed(() => ['footer', `footer--${this.variant()}`, this.showParticles() ? 'footer--with-particles' : ''].filter(Boolean));

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
