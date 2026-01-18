// image.component.ts (Hijo - UIImageComponent)
import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificImageVariants = ['polaroid'] as const;

// Combinamos variantes globales con específicas
export const imageVariants = [...baseVariants, ...specificImageVariants] as const;
export type ImageVariantType = typeof imageVariants[number] | (string & {});

export type ImageSize = 'small' | 'medium' | 'large' | 'custom';
export type ImageShape = 'square' | 'circle' | 'rounded';
export type ImageAnimation = 'none' | 'fade' | 'zoom' | 'slide';

export interface ImageCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--image-border'?: string;
  '--image-shadow'?: string;
  '--image-bg'?: string;
  '--image-accent'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class UIImageComponent {
  src = input<string>('https://via.placeholder.com/300'); // URL por defecto
  alt = input<string>('Image description');
  size = input<ImageSize>('medium');
  width = input<string | undefined>(undefined); // Para tamaño custom (ej. '500px')
  height = input<string | undefined>(undefined); // Para tamaño custom (ej. '300px')
  shape = input<ImageShape>('square');
  caption = input<string | undefined>(undefined); // Leyenda opcional
  variant = input<ImageVariantType>('default');
  animation = input<ImageAnimation>('none');
  customStyles = input<ImageCustomStyles>({}); // Soporte para estilos personalizados

  imageClasses = computed(() => [
    'image-container',
    `image--size-${this.size()}`,
    `image--shape-${this.shape()}`,
    `image--${this.variant()}`,
    this.caption() ? 'image--with-caption' : '',
    `image--animation-${this.animation()}`,
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
