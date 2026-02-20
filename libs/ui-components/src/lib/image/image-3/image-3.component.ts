import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificImage3Variants = ['polaroid'] as const;
export const image3Variants = [...baseVariants, ...specificImage3Variants] as const;
export type Image3VariantType = typeof image3Variants[number] | (string & {});

export type Image3Size = 'small' | 'medium' | 'large' | 'custom';
export type Image3Shape = 'square' | 'circle' | 'rounded';
export type Image3Animation = 'none' | 'fade' | 'zoom' | 'slide';

export interface Image3CustomStyles {
  backgroundColor?: string;
  color?: string;
  '--image-border'?: string;
  '--image-shadow'?: string;
  '--image-bg'?: string;
  '--image-accent'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-image-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-3.component.html',
  styleUrls: ['./image-3.component.scss'],
})
export class UIImage3Component {
  src = input<string>('https://via.placeholder.com/300');
  alt = input<string>('Image description');
  size = input<Image3Size>('medium');
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);
  shape = input<Image3Shape>('square');
  caption = input<string | undefined>(undefined);
  variant = input<Image3VariantType>('secondary');
  animation = input<Image3Animation>('none');
  customStyles = input<Image3CustomStyles>({});

  imageClasses = computed(() => [
    'image-3-container',
    `image-3--size-${this.size()}`,
    `image-3--shape-${this.shape()}`,
    `image-3--${this.variant()}`,
    this.caption() ? 'image-3--with-caption' : '',
    `image-3--animation-${this.animation()}`,
  ].filter(Boolean));

  imageStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['backgroundColor']) {
      styles['--theme-bg'] = customStyles['backgroundColor'];
      styles['--image-bg'] = customStyles['backgroundColor'];
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

    if (this.size() === 'custom' && this.width()) styles['width'] = this.width();
    if (this.size() === 'custom' && this.height()) styles['height'] = this.height();

    return styles;
  });
}
