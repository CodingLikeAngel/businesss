import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const navBar3Variants = variants;
export type NavBar3VariantType = typeof navBar3Variants[number];

export interface NavBar3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface NavBar3Item {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-nav-bar-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar-3.component.html',
  styleUrl: './nav-bar-3.component.scss',
})
export class UINavBar3Component {
  variant = input<NavBar3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<NavBar3Item[]>([]);
  customStyles = input<NavBar3CustomStyles>({});

  navBarStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--component-bg'] = customStyles['backgroundColor'];
      styles['background'] = customStyles['backgroundColor'];
      styles['background-color'] = customStyles['backgroundColor'];
    }
    
    if (customStyles['color']) {
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
    const classes = ['nav-bar-3', `nav-bar-3-${this.variant()}`];
    classes.push(`nav-bar-3-rounded-${this.rounded()}`);
    classes.push(`nav-bar-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: NavBar3Item) => {
      const classes = ['nav-bar-3-item'];
      classes.push(`nav-bar-3-item-${this.size()}`);
      if (item.disabled) classes.push('disabled');
      return classes.join(' ');
    };
  });
}
