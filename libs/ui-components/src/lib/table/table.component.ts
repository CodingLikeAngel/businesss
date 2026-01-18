// table.component.ts (Hijo - UITableComponent)
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../models/ui-components-data.model';

// Variante específica del componente hijo
const specificTableVariants = ['data-grid'] as const;

// Combinamos variantes globales con específicas
export const tableVariants = [...baseVariants, ...specificTableVariants] as const;
export type TableVariantType = typeof tableVariants[number] | (string & {});

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string | number;
}

export interface TableCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class UITableComponent {
  variant = input<TableVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  columns = input<TableColumn[]>([]);
  rows = input<TableRow[]>([]);
  customStyles = input<TableCustomStyles>({});

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
    const classes = ['table-container', `table-${this.variant()}`];
    classes.push(`table-rounded-${this.rounded()}`);
    classes.push(`table-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  headerClasses = computed(() => {
    const classes = ['table-header'];
    classes.push(`header-${this.size()}`);
    return classes.join(' ');
  });

  cellClasses = computed(() => {
    const classes = ['table-cell'];
    classes.push(`cell-${this.size()}`);
    return classes.join(' ');
  });
}
