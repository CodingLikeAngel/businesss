import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const title1Variants = variants;
export type Title1VariantType = typeof title1Variants[number];

export interface Title1CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-title-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-1.component.html',
  styleUrl: './title-1.component.scss',
})
export class UITitle1Component {
  variant = input<Title1VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  dark = input<boolean>(false);
  weight = input<'normal' | 'medium' | 'semibold' | 'bold'>('semibold');
  align = input<'left' | 'center' | 'right'>('left');
  content = input<string>('Title');
  customStyles = input<Title1CustomStyles>({});

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
    const classes = ['title-1', `title-1-${this.variant()}`];
    classes.push(`title-1-${this.size()}`);
    classes.push(`title-1-${this.weight()}`);
    classes.push(`title-1-${this.align()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
