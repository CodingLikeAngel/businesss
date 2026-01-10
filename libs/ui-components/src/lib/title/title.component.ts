// title.component.ts (Hijo - UITitleComponent)
import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificTitleVariants = ['arcade'] as const;

// Combinamos variantes globales con específicas
export const titleVariants = [...baseVariants, ...specificTitleVariants] as const;
export type TitleVariantType = typeof titleVariants[number] | (string & {});

export type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TitleAnimation = 'none' | 'fade' | 'pulse' | 'bounce' | 'glitch' | 'slide';

interface TitleCustomStyles {
  '--title-color'?: string;
  '--title-shadow'?: string;
  '--title-bg'?: string;
  '--title-border'?: string;
  '--title-accent'?: string;
}

@Component({
  selector: 'lib-ui-components-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class UITitleComponent {
  level = input<TitleLevel>('h1');
  text = input<string>('Título por defecto');
  icon = input<string | undefined>(undefined); // Icono opcional (emoji o clase de ícono)
  variant = input<TitleVariantType>('default');
  animation = input<TitleAnimation>('none');
  align = input<'left' | 'center' | 'right'>('left');
  customStyles = input<TitleCustomStyles>({}); // Soporte para estilos personalizados

  titleClasses = computed(() => [
    'title',
    `title--${this.level()}`,
    `title--${this.variant()}`,
    this.icon() ? 'title--with-icon' : '',
    `title--animation-${this.animation()}`,
    `title--align-${this.align()}`,
  ].filter(Boolean));

  titleStyles = computed(() => ({
    ...this.customStyles(),
    color: this.customStyles()['--title-color'],
    'text-shadow': this.customStyles()['--title-shadow'],
    background: this.customStyles()['--title-bg'],
    border: this.customStyles()['--title-border'],
    '--title-accent': this.customStyles()['--title-accent'], // Variable CSS para usar en SCSS
  }));
}