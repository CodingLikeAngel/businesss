import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { variants } from '../../models/ui-components-data.model';

export const breadcrumbs2Variants = variants;
export type Breadcrumbs2VariantType = typeof breadcrumbs2Variants[number];

export interface Breadcrumbs2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Breadcrumbs2Item {
  label: string;
  path?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-breadcrumbs-2',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs-2.component.html',
  styleUrl: './breadcrumbs-2.component.scss',
})
export class UIBreadcrumbs2Component {
  variant = input<Breadcrumbs2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Breadcrumbs2Item[]>([]);
  customStyles = input<Breadcrumbs2CustomStyles>({});

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
    const classes = ['breadcrumbs-2', `breadcrumbs-2-${this.variant()}`];
    classes.push(`breadcrumbs-2-rounded-${this.rounded()}`);
    classes.push(`breadcrumbs-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses(item: Breadcrumbs2Item, index: number): string {
    const classes = ['breadcrumbs-2-item'];
    if (item.disabled) classes.push('disabled');
    if (index === this.items().length - 1) classes.push('active');
    return classes.join(' ');
  }
}
