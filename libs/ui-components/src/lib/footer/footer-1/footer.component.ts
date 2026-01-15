import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
  private _dark = false;
  private _showParticles = true;

  @Input()
  get dark(): boolean {
    return this._dark;
  }
  set dark(value: boolean) {
    this._dark = value;
    this.darkChange.emit(this._dark);
  }

  @Input()
  get showParticles(): boolean {
    return this._showParticles;
  }
  set showParticles(value: boolean) {
    this._showParticles = value;
    this.showParticlesChange.emit(this._showParticles);
  }

  @Input() variant: string = 'primary';
  @Input() title = 'Outdoor Haven';
  @Input() description = 'Todo lo que necesitas para tus aventuras al aire libre';
  @Input() exploreLinks: Link[] = [
    { label: 'Pesca', href: '#', icon: '🎣' },
    { label: 'Caza', href: '#', icon: '🏹' },
    { label: 'Senderismo', href: '#', icon: '🏔️' },
    { label: 'Comida', href: '#', icon: '🍖' },
  ];
  @Input() trendLinks: Link[] = [
    { label: 'Ayuda', href: '#', icon: '❓' },
    { label: 'Devoluciones', href: '#', icon: '🔄' },
    { label: 'Contacto', href: '#', icon: '✉️' },
  ];
  @Input() socialIcons: SocialIcon[] = [
    { name: 'twitter', href: '#' },
    { name: 'facebook', href: '#' },
    { name: 'instagram', href: '#' },
  ];
  @Input() copyrightText = '© {{currentYear}} Outdoor Haven - Equípate para la naturaleza';
  @Input() customStyles: FooterCustomStyles = {};

  @Output() linkClicked = new EventEmitter<string>();
  @Output() socialClicked = new EventEmitter<string>();
  @Output() darkChange = new EventEmitter<boolean>();
  @Output() showParticlesChange = new EventEmitter<boolean>();

  currentYear = new Date().getFullYear();

  ngOnInit() {
    console.log('Custom Styles:', this.customStyles);
  }

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
    const isCustomVariant = this.variant.startsWith('custom-footer');
    return [
      'footer',
      isCustomVariant ? 'footer--custom' : `variant-${this.variant}`,
      this.dark ? 'dark' : '',
      this.showParticles ? 'footer--with-particles' : 'footer--no-particles',
    ].filter(Boolean);
  }
}
