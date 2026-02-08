import { Component, input, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const draggableBox1Variants = variants;
export type DraggableBox1VariantType = typeof draggableBox1Variants[number];

export interface DraggableBox1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-draggable-box-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './draggable-box-1.component.html',
  styleUrl: './draggable-box-1.component.scss',
})
export class UIDraggableBox1Component implements AfterViewInit {
  variant = input<DraggableBox1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  content = input<string>('Drag me');
  customStyles = input<DraggableBox1CustomStyles>({});

  @ViewChild('draggableBox', { static: true }) draggableBox!: ElementRef<HTMLElement>;

  boxStyles = computed(() => {
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
      if (key !== 'backgroundColor' && key !== 'color' && key !== 'borderRadius') {
        styles[key] = customStyles[key];
      }
    });

    // Only apply manual borderRadius if preset is 'md' (standard/manual)
    if (this.rounded() === 'md' && customStyles['borderRadius']) {
      styles['borderRadius'] = customStyles['borderRadius'];
    }

    return styles;
  });

  boxClasses = computed(() => {
    const classes = ['draggable-box-1', `variant-${this.variant()}`];
    classes.push(`draggable-box-1-rounded-${this.rounded()}`);
    classes.push(`draggable-box-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  ngAfterViewInit(): void {
    // Dragging is now handled by the editor layer using appResizeHandle 'move' anchor
  }
}
