import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const navBar2Variants = variants;
export type NavBar2VariantType = typeof navBar2Variants[number];

export interface NavBar2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface NavBar2Item {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-nav-bar-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar-2.component.html',
  styleUrl: './nav-bar-2.component.scss',
})
export class UINavBar2Component {
  variant = input<NavBar2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<NavBar2Item[]>([]);
  customStyles = input<NavBar2CustomStyles>({});

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
    const classes = ['nav-bar-2', `nav-bar-2-${this.variant()}`];
    classes.push(`nav-bar-2-rounded-${this.rounded()}`);
    classes.push(`nav-bar-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: NavBar2Item) => {
      const classes = ['nav-bar-2-item'];
      classes.push(`nav-bar-2-item-${this.size()}`);
      if (item.disabled) classes.push('disabled');
      return classes.join(' ');
    };
  });
}
