import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tooltip1Variants = variants;
export type Tooltip1VariantType = typeof tooltip1Variants[number];

export interface Tooltip1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-tooltip-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip-1.component.html',
  styleUrl: './tooltip-1.component.scss',
})
export class UITooltip1Component {
  variant = input<Tooltip1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  content = input<string>('Tooltip content');
  isOpen = input<boolean>(false);
  customStyles = input<Tooltip1CustomStyles>({});

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
    const classes = ['tooltip-1', `tooltip-1-${this.variant()}`];
    classes.push(`tooltip-1-rounded-${this.rounded()}`);
    classes.push(`tooltip-1-${this.size()}`);
    classes.push(`tooltip-1-${this.position()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
