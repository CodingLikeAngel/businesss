import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { variants } from '../../models/ui-components-data.model';

export const breadcrumbs1Variants = variants;
export type Breadcrumbs1VariantType = typeof breadcrumbs1Variants[number];

export interface Breadcrumbs1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Breadcrumbs1Item {
  label: string;
  path?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-ui-components-breadcrumbs-1',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs-1.component.html',
  styleUrl: './breadcrumbs-1.component.scss',
})
export class UIBreadcrumbs1Component {
  variant = input<Breadcrumbs1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Breadcrumbs1Item[]>([]);
  customStyles = input<Breadcrumbs1CustomStyles>({});

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
    const classes = ['breadcrumbs-1', `breadcrumbs-1-${this.variant()}`];
    classes.push(`breadcrumbs-1-rounded-${this.rounded()}`);
    classes.push(`breadcrumbs-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: Breadcrumbs1Item, index: number) => {
      const classes = ['breadcrumbs-1-item'];
      if (item.disabled) classes.push('disabled');
      if (index === this.items().length - 1) classes.push('active');
      return classes.join(' ');
    };
  });
}
