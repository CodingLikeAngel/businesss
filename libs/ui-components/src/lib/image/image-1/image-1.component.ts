import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificImage1Variants = ['polaroid'] as const;
export const image1Variants = [...baseVariants, ...specificImage1Variants] as const;
export type Image1VariantType = typeof image1Variants[number] | (string & {});

export type Image1Size = 'small' | 'medium' | 'large' | 'custom';
export type Image1Shape = 'square' | 'circle' | 'rounded';
export type Image1Animation = 'none' | 'fade' | 'zoom' | 'slide';

export interface Image1CustomStyles {
  backgroundColor?: string;
  color?: string;
  '--image-border'?: string;
  '--image-shadow'?: string;
  '--image-bg'?: string;
  '--image-accent'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-image-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-1.component.html',
  styleUrls: ['./image-1.component.scss'],
})
export class UIImage1Component {
  src = input<string>('https://via.placeholder.com/300');
  alt = input<string>('Image description');
  size = input<Image1Size>('medium');
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);
  shape = input<Image1Shape>('square');
  caption = input<string | undefined>(undefined);
  variant = input<Image1VariantType>('default');
  animation = input<Image1Animation>('none');
  customStyles = input<Image1CustomStyles>({});

  imageClasses = computed(() => [
    'image-1-container',
    `image-1--size-${this.size()}`,
    `image-1--shape-${this.shape()}`,
    `image-1--${this.variant()}`,
    this.caption() ? 'image-1--with-caption' : '',
    `image-1--animation-${this.animation()}`,
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
