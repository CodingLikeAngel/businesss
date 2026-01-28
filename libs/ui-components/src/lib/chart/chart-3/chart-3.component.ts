import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const chart3Variants = variants;
export type Chart3VariantType = typeof chart3Variants[number];

export interface Chart3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Chart3DataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'lib-ui-components-chart-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-3.component.html',
  styleUrl: './chart-3.component.scss',
})
export class UIChart3Component {
  variant = input<Chart3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Chart');
  data = input<Chart3DataPoint[]>([]);
  customStyles = input<Chart3CustomStyles>({});

  chartStyles = computed(() => {
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

  chartClasses = computed(() => {
    const classes = ['chart-3', `chart-3-${this.variant()}`];
    classes.push(`chart-3-rounded-${this.rounded()}`);
    classes.push(`chart-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  maxValue = computed(() => {
    return Math.max(...this.data().map(d => d.value));
  });
}
