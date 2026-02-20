import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificImage2Variants = ['polaroid'] as const;
export const image2Variants = [...baseVariants, ...specificImage2Variants] as const;
export type Image2VariantType = typeof image2Variants[number] | (string & {});

export type Image2Size = 'small' | 'medium' | 'large' | 'custom';
export type Image2Shape = 'square' | 'circle' | 'rounded';
export type Image2Animation = 'none' | 'fade' | 'zoom' | 'slide';

export interface Image2CustomStyles {
  backgroundColor?: string;
  color?: string;
  '--image-border'?: string;
  '--image-shadow'?: string;
  '--image-bg'?: string;
  '--image-accent'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-image-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-2.component.html',
  styleUrls: ['./image-2.component.scss'],
})
export class UIImage2Component {
  src = input<string>('https://via.placeholder.com/300');
  alt = input<string>('Image description');
  size = input<Image2Size>('medium');
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);
  shape = input<Image2Shape>('square');
  caption = input<string | undefined>(undefined);
  variant = input<Image2VariantType>('primary');
  animation = input<Image2Animation>('none');
  customStyles = input<Image2CustomStyles>({});

  imageClasses = computed(() => [
    'image-2-container',
    `image-2--size-${this.size()}`,
    `image-2--shape-${this.shape()}`,
    `image-2--${this.variant()}`,
    this.caption() ? 'image-2--with-caption' : '',
    `image-2--animation-${this.animation()}`,
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
