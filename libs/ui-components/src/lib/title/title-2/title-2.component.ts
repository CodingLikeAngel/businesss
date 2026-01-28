import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const title2Variants = variants;
export type Title2VariantType = typeof title2Variants[number];

export interface Title2CustomStyles {
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-title-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-2.component.html',
  styleUrl: './title-2.component.scss',
})
export class UITitle2Component {
  variant = input<Title2VariantType>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  dark = input<boolean>(false);
  weight = input<'normal' | 'medium' | 'semibold' | 'bold'>('semibold');
  align = input<'left' | 'center' | 'right'>('left');
  content = input<string>('Title');
  customStyles = input<Title2CustomStyles>({});

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
    const classes = ['title-2', `title-2-${this.variant()}`];
    classes.push(`title-2-${this.size()}`);
    classes.push(`title-2-${this.weight()}`);
    classes.push(`title-2-${this.align()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });
}
