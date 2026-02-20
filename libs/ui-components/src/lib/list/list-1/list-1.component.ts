import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificList1Variants = ['cosmic-dust'] as const;
export const list1Variants = [...baseVariants, ...specificList1Variants] as const;
export type List1VariantType = typeof list1Variants[number] | (string & {});

export interface List1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-list-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-1.component.html',
  styleUrls: ['./list-1.component.scss'],
})
export class UIList1Component {
  variant = input<List1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<string[]>([]);
  customStyles = input<List1CustomStyles>({});

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
    const classes = ['list-1-container', `list-1-variant-${this.variant()}`];
    classes.push(`list-1-rounded-${this.rounded()}`);
    classes.push(`list-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    const classes = ['list-1-item'];
    classes.push(`list-1-item-${this.size()}`);
    return classes.join(' ');
  });
}
