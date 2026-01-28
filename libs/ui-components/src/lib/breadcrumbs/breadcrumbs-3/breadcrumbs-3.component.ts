import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { variants } from '../../models/ui-components-data.model';

export const breadcrumbs3Variants = variants;
export type Breadcrumbs3VariantType = typeof breadcrumbs3Variants[number];

export interface Breadcrumbs3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Breadcrumbs3Item {
  label: string;
  path?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-breadcrumbs-3',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs-3.component.html',
  styleUrl: './breadcrumbs-3.component.scss',
})
export class UIBreadcrumbs3Component {
  variant = input<Breadcrumbs3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Breadcrumbs3Item[]>([]);
  customStyles = input<Breadcrumbs3CustomStyles>({});

  breadcrumbsStyles = computed(() => {
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

  breadcrumbsClasses = computed(() => {
    const classes = ['breadcrumbs-3', `breadcrumbs-3-${this.variant()}`];
    classes.push(`breadcrumbs-3-rounded-${this.rounded()}`);
    classes.push(`breadcrumbs-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses(item: Breadcrumbs3Item, index: number): string {
    const classes = ['breadcrumbs-3-item'];
    if (item.disabled) classes.push('disabled');
    if (index === this.items().length - 1) classes.push('active');
    return classes.join(' ');
  }
}
