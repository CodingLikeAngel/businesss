import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

export const headerVariants = baseVariants;
export type DefaultHeaderVariant = typeof headerVariants[number];
export type HeaderVariantType = DefaultHeaderVariant | (string & {});

export interface HeaderCustomStyles {
  '--header-bg'?: string;
  '--header-color'?: string;
  '--header-border'?: string;
  '--header-shadow'?: string;
  '--header-hover-bg'?: string;
  '--header-hover-shadow'?: string;
}

@Component({
  selector: 'lib-ui-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class UIHeaderComponent {
  title = input('Header Title');
  subtitle = input('');
  variant = input<HeaderVariantType>('primary');
  align = input<'left' | 'center' | 'right'>('center');
  dark = input(false);
  navItems = input<{ label: string; href: string; active?: boolean }[]>([]);
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
  ].filter(Boolean));

  headerStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    
    // If a manual background color is provided, it should set --theme-bg
    // so it interacts correctly with our CSS variable system.
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }

    return styles;
  });
}
