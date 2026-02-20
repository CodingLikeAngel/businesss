import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificList3Variants = ['cosmic-dust'] as const;
export const list3Variants = [...baseVariants, ...specificList3Variants] as const;
export type List3VariantType = typeof list3Variants[number] | (string & {});

export interface List3CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-list-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-3.component.html',
  styleUrl: './list-3.component.scss',
})
export class UIList3Component {
  variant = input<List3VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<string[]>([]);
  customStyles = input<List3CustomStyles>({});

  listStyles = computed(() => {
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

  listClasses = computed(() => {
    const classes = ['list-3-container', `list-3-variant-${this.variant()}`];
    classes.push(`list-3-rounded-${this.rounded()}`);
    classes.push(`list-3-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    const classes = ['list-3-item'];
    classes.push(`list-3-item-${this.size()}`);
    return classes.join(' ');
  });
}
