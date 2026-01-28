import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const gallery2Variants = variants;
export type Gallery2VariantType = typeof gallery2Variants[number];

export interface Gallery2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Gallery2Item {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

@Component({
  selector: 'lib-ui-components-gallery-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-2.component.html',
  styleUrl: './gallery-2.component.scss',
})
export class UIGallery2Component {
  variant = input<Gallery2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<Gallery2Item[]>([]);
  columns = input<number>(3);
  customStyles = input<Gallery2CustomStyles>({});

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
    const classes = ['gallery-2', `gallery-2-${this.variant()}`];
    classes.push(`gallery-2-rounded-${this.rounded()}`);
    classes.push(`gallery-2-${this.size()}`);
    classes.push(`gallery-2-cols-${this.columns()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    return (item: Gallery2Item) => {
      const classes = ['gallery-2-item'];
      classes.push(`gallery-2-item-${this.size()}`);
      return classes.join(' ');
    };
  });
}
