import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const spinner1Variants = variants;
export type Spinner1VariantType = typeof spinner1Variants[number];

export interface Spinner1CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-spinner-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-1.component.html',
  styleUrl: './spinner-1.component.scss',
})
export class UISpinner1Component {
  variant = input<Spinner1VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  speed = input<'slow' | 'normal' | 'fast'>('normal');
  customStyles = input<Spinner1CustomStyles>({});

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
    const classes = ['spinner-1', `spinner-1-${this.variant()}`];
    classes.push(`spinner-1-${this.size()}`);
    classes.push(`spinner-1-${this.speed()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
