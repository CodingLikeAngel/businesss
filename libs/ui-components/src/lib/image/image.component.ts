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
  selector: 'lib-ui-components-image',
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
  filter = input<string | undefined>(undefined); // CSS filters (ej. 'grayscale(100%) blur(2px)')
  objectFit = input<'cover' | 'contain' | 'fill' | 'none' | 'scale-down'>('cover');
  objectPosition = input<string>('center');
  customStyles = input<ImageCustomStyles>({}); // Soporte para estilos personalizados

  imageClasses = computed(() => [
// ... (lines 47-53 stay similar)
  ].filter(Boolean));

  imageStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    // Base styles from customStyles
    Object.keys(customStyles).forEach(key => {
      styles[key] = customStyles[key];
    });

    if (customStyles['backgroundColor']) {
      styles['--image-bg'] = customStyles['backgroundColor'];
    }

    // Smart Image features
    if (this.filter()) styles['filter'] = this.filter();
    
    // Pass object fit/position to the img element via variables
    styles['--img-fit'] = this.objectFit();
    styles['--img-position'] = this.objectPosition();

    if (this.size() === 'custom' && this.width()) styles['width'] = this.width();
    if (this.size() === 'custom' && this.height()) styles['height'] = this.height();

    return styles;
  });
}
