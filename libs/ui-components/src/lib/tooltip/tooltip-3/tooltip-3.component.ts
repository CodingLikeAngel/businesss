import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const tooltip3Variants = variants;
export type Tooltip3VariantType = typeof tooltip3Variants[number];

export interface Tooltip3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-tooltip-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip-3.component.html',
  styleUrl: './tooltip-3.component.scss',
})
export class UITooltip3Component {
  variant = input<Tooltip3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  content = input<string>('Tooltip content');
  isOpen = input<boolean>(false);
  customStyles = input<Tooltip3CustomStyles>({});

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
    const classes = ['tooltip-3', `tooltip-3-${this.variant()}`];
    classes.push(`tooltip-3-rounded-${this.rounded()}`);
    classes.push(`tooltip-3-${this.size()}`);
    classes.push(`tooltip-3-${this.position()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
