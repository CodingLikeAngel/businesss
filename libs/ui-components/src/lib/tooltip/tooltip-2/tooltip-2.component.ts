import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tooltip2Variants = variants;
export type Tooltip2VariantType = typeof tooltip2Variants[number];

export interface Tooltip2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-tooltip-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip-2.component.html',
  styleUrl: './tooltip-2.component.scss',
})
export class UITooltip2Component {
  variant = input<Tooltip2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  content = input<string>('Tooltip content');
  isOpen = input<boolean>(false);
  customStyles = input<Tooltip2CustomStyles>({});

  tooltipStyles = computed(() => {
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

  tooltipClasses = computed(() => {
    const classes = ['tooltip-2', `tooltip-2-${this.variant()}`];
    classes.push(`tooltip-2-rounded-${this.rounded()}`);
    classes.push(`tooltip-2-${this.size()}`);
    classes.push(`tooltip-2-${this.position()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
