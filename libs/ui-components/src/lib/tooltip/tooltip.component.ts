// tooltip.component.ts (Hijo - UITooltipComponent)
import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

// Variante específica del componente hijo
const specificTooltipVariants = ['pixel-info'] as const;

// Combinamos variantes globales con específicas
export const tooltipVariants = [...baseVariants, ...specificTooltipVariants] as const;
export type TooltipVariantType = typeof tooltipVariants[number] | (string & {});

export interface TooltipCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--tooltip-bg'?: string;
  '--tooltip-color'?: string;
  '--tooltip-border'?: string;
  '--tooltip-shadow'?: string;
  '--tooltip-radius'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UITooltipComponent {
  variant = input<TooltipVariantType>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  content = input<string>('Tooltip Content');
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  customStyles = input<TooltipCustomStyles>({}); // Soporte para estilos personalizados

  wrapperClasses = computed(() => {
    return ['tooltip-wrapper'].join(' ');
  });

  tooltipClasses = computed(() => {
    const classes = [
      'tooltip',
      `tooltip-${this.variant()}`,
      `tooltip-${this.size()}`,
      `tooltip-${this.position()}`,
    ];
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  tooltipStyles = computed(() => mergeCustomStyles(this.customStyles(), 'tooltip'));
}
