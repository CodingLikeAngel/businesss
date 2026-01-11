import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { variants } from '../../models/ui-components-data.model';

export { variants as navBarVariants };
export type DefaultNavBarVariant = typeof variants[number];
export type NavBarVariant = string;

export interface NavBarCustomStyles {
  '--nav-bg'?: string;
  '--nav-color'?: string;
  '--nav-border'?: string;
  '--nav-shadow'?: string;
  '--nav-hover-bg'?: string;
  '--nav-hover-shadow'?: string;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

@Component({
  selector: 'lib-ui-components-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],

})
export class UINavBarComponent implements OnInit, OnChanges {
  @Input() variant: NavBarVariant = 'success';
  @Input() logoText = 'Foro León';
  @Input() navLinks: NavLink[] = [
    { label: 'Inicio', href: '#home', icon: '🏠' },
    { label: 'Pesca', href: '#pesca', icon: '🎣' },
    { label: 'Senderismo', href: '#senderismo', icon: '🏞️' },
    { label: 'Foro', href: '#foro', icon: '💬' },
    { label: 'Contacto', href: '/contact', icon: '✉️' },
  ];
  @Input() showMobileMenu = true;
  @Input() isFixed = true;
  @Input() isDarkMode = false;
  @Input() isMobile = false;
  @Input() customStyles: NavBarCustomStyles = {};
  @Output() linkClicked = new EventEmitter<string>();
  @Output() darkModeChange = new EventEmitter<boolean>();

  isMobileMenuOpen = false;

  ngOnInit() {
    console.log('NavBar initialized with navLinks:', this.navLinks);
    console.log('Initial isDarkMode:', this.isDarkMode);
    console.log('Initial isMobile:', this.isMobile);
    console.log('Initial showMobileMenu:', this.showMobileMenu);
  }

  ngOnChanges() {
    console.log('isMobile updated:', this.isMobile);
    console.log('showMobileMenu updated:', this.showMobileMenu);
    console.log('Custom Styles updated:', JSON.stringify(this.customStyles, null, 2));
    console.log('navLinks updated:', this.navLinks);
    console.log('isDarkMode updated:', this.isDarkMode);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Mobile menu toggled:', this.isMobileMenuOpen);
  }

  onLinkClick(href: string) {
    this.linkClicked.emit(href);
    this.isMobileMenuOpen = false;
    console.log('Link clicked:', href);
  }

  onDarkModeChange() {
    this.darkModeChange.emit(this.isDarkMode);
    console.log('Dark Mode toggled:', this.isDarkMode);
  }

  onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMobileMenu();
      console.log('Overlay keydown closed menu');
    }
  }

  get navBarClasses(): string[] {
    const classes = [
      'nav-bar',
      `variant-${this.variant}`,
      this.isMobileMenuOpen ? 'nav-bar--mobile-open' : '',
      this.isFixed ? 'nav-bar--fixed' : '',
      this.isDarkMode ? 'nav-bar--dark' : '',
      this.isMobile ? 'nav-bar--force-mobile' : '',
    ].filter(Boolean);
    console.log('NavBar Classes:', classes);
    return classes;
  }
}