import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const table2Variants = variants;
export type Table2VariantType = typeof table2Variants[number];

export interface Table2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Table2Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface Table2Row {
  [key: string]: any;
}

@Component({
  selector: 'lib-ui-components-table-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-2.component.html',
  styleUrl: './table-2.component.scss',
})
export class UITable2Component {
  variant = input<Table2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  striped = input<boolean>(false);
  hoverable = input<boolean>(false);
  columns = input<Table2Column[]>([]);
  data = input<Table2Row[]>([]);
  customStyles = input<Table2CustomStyles>({});

  tableStyles = computed(() => {
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

  tableClasses = computed(() => {
    const classes = ['table-2', `table-2-${this.variant()}`];
    classes.push(`table-2-rounded-${this.rounded()}`);
    classes.push(`table-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.striped()) classes.push('striped');
    if (this.hoverable()) classes.push('hoverable');
    return classes.join(' ');
  });

  headerClasses = computed(() => {
    const classes = ['table-2-header'];
    classes.push(`header-${this.size()}`);
    return classes.join(' ');
  });

  bodyClasses = computed(() => {
    const classes = ['table-2-body'];
    classes.push(`body-${this.size()}`);
    return classes.join(' ');
  });

  trackByFn(index: number, item: Table2Row): string {
    return item['id'] || index.toString();
  }
}
