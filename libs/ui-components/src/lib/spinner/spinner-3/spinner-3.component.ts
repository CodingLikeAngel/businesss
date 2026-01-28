import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const spinner3Variants = variants;
export type Spinner3VariantType = typeof spinner3Variants[number];

export interface Spinner3CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-spinner-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-3.component.html',
  styleUrl: './spinner-3.component.scss',
})
export class UISpinner3Component {
  variant = input<Spinner3VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  speed = input<'slow' | 'normal' | 'fast'>('normal');
  customStyles = input<Spinner3CustomStyles>({});

  spinnerStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--spinner-color'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  spinnerClasses = computed(() => {
    const classes = ['spinner-3', `spinner-3-${this.variant()}`];
    classes.push(`spinner-3-${this.size()}`);
    classes.push(`spinner-3-${this.speed()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
