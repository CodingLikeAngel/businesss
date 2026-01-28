import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const gallery3Variants = variants;
export type Gallery3VariantType = typeof gallery3Variants[number];

export interface Gallery3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Gallery3Item {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

@Component({
  selector: 'lib-ui-components-gallery-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-3.component.html',
  styleUrl: './gallery-3.component.scss',
})
export class UIGallery3Component {
  variant = input<Gallery3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Gallery3Item[]>([]);
  columns = input<number>(3);
  customStyles = input<Gallery3CustomStyles>({});

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
    const classes = ['gallery-3', `gallery-3-${this.variant()}`];
    classes.push(`gallery-3-rounded-${this.rounded()}`);
    classes.push(`gallery-3-${this.size()}`);
    classes.push(`gallery-3-cols-${this.columns()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: Gallery3Item) => {
      const classes = ['gallery-3-item'];
      classes.push(`gallery-3-item-${this.size()}`);
      return classes.join(' ');
    };
  });
}
