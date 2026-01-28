import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const spinner2Variants = variants;
export type Spinner2VariantType = typeof spinner2Variants[number];

export interface Spinner2CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-spinner-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-2.component.html',
  styleUrl: './spinner-2.component.scss',
})
export class UISpinner2Component {
  variant = input<Spinner2VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  speed = input<'slow' | 'normal' | 'fast'>('normal');
  customStyles = input<Spinner2CustomStyles>({});

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
    const classes = ['spinner-2', `spinner-2-${this.variant()}`];
    classes.push(`spinner-2-${this.size()}`);
    classes.push(`spinner-2-${this.speed()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
