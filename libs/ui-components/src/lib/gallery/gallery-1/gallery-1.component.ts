import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const gallery1Variants = variants;
export type Gallery1VariantType = typeof gallery1Variants[number];

export interface Gallery1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Gallery1Item {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

@Component({
  selector: 'lib-ui-components-gallery-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-1.component.html',
  styleUrl: './gallery-1.component.scss',
})
export class UIGallery1Component {
  variant = input<Gallery1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Gallery1Item[]>([]);
  columns = input<number>(3);
  customStyles = input<Gallery1CustomStyles>({});

  galleryStyles = computed(() => {
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

  galleryClasses = computed(() => {
    const classes = ['gallery-1', `gallery-1-${this.variant()}`];
    classes.push(`gallery-1-rounded-${this.rounded()}`);
    classes.push(`gallery-1-${this.size()}`);
    classes.push(`gallery-1-cols-${this.columns()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: Gallery1Item) => {
      const classes = ['gallery-1-item'];
      classes.push(`gallery-1-item-${this.size()}`);
      return classes.join(' ');
    };
  });
}
