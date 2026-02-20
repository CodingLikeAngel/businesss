import { Component, OnInit, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { variants } from '../../models/ui-components-data.model';

export { variants as navBarVariants };
export type DefaultNavBarVariant = typeof variants[number];
export type NavBarVariant = string;

export interface NavBarCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--nav-bg'?: string;
  '--nav-color'?: string;
  '--nav-border'?: string;
  '--nav-shadow'?: string;
  '--nav-hover-bg'?: string;
  '--nav-hover-shadow'?: string;
  [key: string]: string | undefined;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  children?: NavLink[];
}

@Component({
  selector: 'lib-ui-components-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',

})
export class UINavBarComponent implements OnInit {
  variant = input<NavBarVariant>('success');
  logoText = input('Foro León');
  navLinks = input<NavLink[]>([
    { label: 'Inicio', href: '#home', icon: '🏠' },
    { label: 'Pesca', href: '#pesca', icon: '🎣' },
    { label: 'Senderismo', href: '#senderismo', icon: '🏞️' },
    { label: 'Foro', href: '#foro', icon: '💬' },
    { label: 'Contacto', href: '/contact', icon: '✉️' },
  ]);
  showMobileMenu = input(true);
  isFixed = input(true);
  isDarkMode = input(false);
  isMobile = input(false);
  customStyles = input<NavBarCustomStyles>({});
  
  linkClicked = output<string>();
  darkModeChange = output<boolean>();

  isMobileMenuOpen = false;

  navStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--nav-bg'] = customStyles['backgroundColor'];
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--nav-color'] = customStyles['color'];
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  navBarClasses = computed(() => {
    return [
      'nav-bar',
      `variant-${this.variant()}`,
      this._isMobileMenuOpen() ? 'nav-bar--mobile-open' : '',
      this.isFixed() ? 'nav-bar--fixed' : '',
      this.isDarkMode() ? 'nav-bar--dark' : '',
      this.isMobile() ? 'nav-bar--force-mobile' : '',
    ].filter(Boolean).join(' ');
  });

  // Since isMobileMenuOpen is mutable property, we cannot just use it in computed() effectively if we want reactivity.
  // We need to change isMobileMenuOpen to a signal OR use a getter for classes that combines computed signals + property.
  // HOWEVER, computed() caches. If it reads a non-signal, it won't re-compute when that property changes.
  // So we should make isMobileMenuOpen a signal or just use a getter.
  // Standard Architecture: Internal state as signal.
  _isMobileMenuOpen = signal(false);

  // Getter for template to facilitate standard property access if desired, but better to use signal in template.
  
  navBarClassesSignal = computed(() => {
    return [
      'nav-bar',
      `variant-${this.variant()}`,
      this._isMobileMenuOpen() ? 'nav-bar--mobile-open' : '',
      this.isFixed() ? 'nav-bar--fixed' : '',
      this.isDarkMode() ? 'nav-bar--dark' : '',
      this.isMobile() ? 'nav-bar--force-mobile' : '',
    ].filter(Boolean); // Returning array for [ngClass]
  });

  ngOnInit() {
    // Logging removed or kept minimal
  }

  toggleMobileMenu() {
    this._isMobileMenuOpen.update(v => !v);
  }

  onLinkClick(href: string) {
    this.linkClicked.emit(href);
    this._isMobileMenuOpen.set(false);
  }

  onDarkModeChange(checked: boolean) {
    this.darkModeChange.emit(checked);
  }

  onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMobileMenu();
    }
  }
}