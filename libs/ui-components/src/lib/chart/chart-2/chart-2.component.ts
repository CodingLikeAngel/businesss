import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const chart2Variants = variants;
export type Chart2VariantType = typeof chart2Variants[number];

export interface Chart2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Chart2DataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'lib-ui-components-chart-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-2.component.html',
  styleUrl: './chart-2.component.scss',
})
export class UIChart2Component {
  variant = input<Chart2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Chart');
  data = input<Chart2DataPoint[]>([]);
  customStyles = input<Chart2CustomStyles>({});

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
    const classes = ['chart-2', `chart-2-${this.variant()}`];
    classes.push(`chart-2-rounded-${this.rounded()}`);
    classes.push(`chart-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  maxValue = computed(() => {
    return Math.max(...this.data().map(d => d.value));
  });
}
