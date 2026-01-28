import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const chart1Variants = variants;
export type Chart1VariantType = typeof chart1Variants[number];

export interface Chart1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Chart1DataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'lib-ui-components-chart-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-1.component.html',
  styleUrl: './chart-1.component.scss',
})
export class UIChart1Component {
  variant = input<Chart1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Chart');
  data = input<Chart1DataPoint[]>([]);
  customStyles = input<Chart1CustomStyles>({});

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
    const classes = ['chart-1', `chart-1-${this.variant()}`];
    classes.push(`chart-1-rounded-${this.rounded()}`);
    classes.push(`chart-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  maxValue = computed(() => {
    return Math.max(...this.data().map(d => d.value));
  });

  getBarStyle(point: Chart1DataPoint): Record<string, string> {
    const height = (point.value / this.maxValue()) * 100;
    return {
      height: `${height}%`
    };
  }
}
