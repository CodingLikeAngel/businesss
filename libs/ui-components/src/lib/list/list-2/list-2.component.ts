import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const specificList2Variants = ['cosmic-dust'] as const;
export const list2Variants = [...baseVariants, ...specificList2Variants] as const;
export type List2VariantType = typeof list2Variants[number] | (string & {});

export interface List2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-list-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-2.component.html',
  styleUrls: ['./list-2.component.scss'],
})
export class UIList2Component {
  variant = input<List2VariantType>('primary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  items = input<string[]>([]);
  customStyles = input<List2CustomStyles>({});

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
    const classes = ['list-2-container', `list-2-variant-${this.variant()}`];
    classes.push(`list-2-rounded-${this.rounded()}`);
    classes.push(`list-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  itemClasses = computed(() => {
    const classes = ['list-2-item'];
    classes.push(`list-2-item-${this.size()}`);
    return classes.join(' ');
  });
}
