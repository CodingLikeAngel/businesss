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

interface ImageCustomStyles {
  '--image-border'?: string;
  '--image-shadow'?: string;
  '--image-bg'?: string;
  '--image-accent'?: string;
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
  customStyles = input<ImageCustomStyles>({}); // Soporte para estilos personalizados

  imageClasses = computed(() => [
    'image-container',
    `image--size-${this.size()}`,
    `image--shape-${this.shape()}`,
    `image--${this.variant()}`,
    this.caption() ? 'image--with-caption' : '',
    `image--animation-${this.animation()}`,
  ].filter(Boolean));

  imageStyles = computed(() => ({
    ...this.customStyles(),
    border: this.customStyles()['--image-border'],
    'box-shadow': this.customStyles()['--image-shadow'],
    background: this.customStyles()['--image-bg'],
    '--image-accent': this.customStyles()['--image-accent'], // Variable CSS para usar en SCSS
    ...(this.size() === 'custom' && this.width() ? { width: this.width() } : {}),
    ...(this.size() === 'custom' && this.height() ? { height: this.height() } : {}),
  }));
}