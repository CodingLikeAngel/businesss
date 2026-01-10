import { Component, Input, OnChanges } from '@angular/core';
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
  selector: 'lib-ui-components-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class UIHeaderComponent  {
  @Input() title = 'Header Title';
  @Input() subtitle = '';
  @Input() variant: HeaderVariantType = 'primary';
  @Input() align: 'left' | 'center' | 'right' = 'center';
  @Input() dark = false;
  @Input() navItems: { label: string; href: string; active?: boolean }[] = [];
  @Input() customStyles: HeaderCustomStyles = {};

  isMenuOpen = false;

  // ngOnChanges() {
  //  // console.log('Custom Styles recibidos:', this.customStyles); // Depuración
  // }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get headerClasses(): string[] {
    return [
      'header',
      `header-${this.variant}`,
      `align-${this.align}`,
      this.dark ? 'dark' : '',
    ].filter(Boolean);
  }
}