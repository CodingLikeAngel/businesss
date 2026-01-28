import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const title3Variants = variants;
export type Title3VariantType = typeof title3Variants[number];

export interface Title3CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-title-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-3.component.html',
  styleUrl: './title-3.component.scss',
})
export class UITitle3Component {
  variant = input<Title3VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  dark = input<boolean>(false);
  weight = input<'normal' | 'medium' | 'semibold' | 'bold'>('semibold');
  align = input<'left' | 'center' | 'right'>('left');
  content = input<string>('Title');
  customStyles = input<Title3CustomStyles>({});

  titleStyles = computed(() => {
    const styles: Record<string, any> = {};
    const customStyles = this.customStyles();
    
    if (customStyles['color']) {
      styles['--theme-color'] = customStyles['color'];
      styles['--component-text'] = customStyles['color'];
      styles['color'] = customStyles['color'];
    }
    
    Object.keys(customStyles).forEach(key => {
      if (key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  titleClasses = computed(() => {
    const classes = ['title-3', `title-3-${this.variant()}`];
    classes.push(`title-3-${this.size()}`);
    classes.push(`title-3-${this.weight()}`);
    classes.push(`title-3-${this.align()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
