import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

export const headerVariants = baseVariants;
export type DefaultHeaderVariant = typeof headerVariants[number];
export type HeaderVariantType = DefaultHeaderVariant | (string & {});

export interface HeaderCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--header-bg'?: string;
  '--header-color'?: string;
  '--header-border'?: string;
  '--header-shadow'?: string;
  '--header-hover-bg'?: string;
  '--header-hover-shadow'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class UIHeaderComponent {
  title = input('Header Title');
  subtitle = input('');
  variant = input<HeaderVariantType>('primary');
  align = input<'left' | 'center' | 'right'>('center');
  dark = input(false);
  sticky = input(true);
  logo = input<string | null>(null);
  navItems = input<{ label: string; href: string; active?: boolean }[]>([]);
  ctaLabel = input<string | null>(null);
  customStyles = input<HeaderCustomStyles>({});

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  headerClasses = computed(() => [
    'header',
    `variant-${this.variant()}`,
    `align-${this.align()}`,
    this.dark() ? 'dark' : '',
    this.sticky() ? 'is-sticky' : '',
  ].filter(Boolean));

  headerStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      // Set CSS variables
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--header-bg'] = customStyles['backgroundColor'];
      // Set direct properties
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--header-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    // Copy any other custom styles
    // ROBUSTNESS: Explicitly filter out keys that can break the header's sticky flow
    const blockedKeys = ['position', 'top', 'left', 'right', 'bottom'];
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color' && !blockedKeys.includes(key)) {
        styles[key] = customStyles[key];
      }
    });
    
    return styles;
  });
}
