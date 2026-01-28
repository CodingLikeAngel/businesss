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
      if (key !== 'backgroundColor' && key !== 'color') {
        styles[key] = customStyles[key];
      }
    });

    return styles;
  });

  boxClasses = computed(() => {
    const classes = ['draggable-box-1', `draggable-box-1-${this.variant()}`];
    classes.push(`draggable-box-1-rounded-${this.rounded()}`);
    classes.push(`draggable-box-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  ngAfterViewInit(): void {
    this.initDraggable();
  }

  private initDraggable(): void {
    const element = this.draggableBox.nativeElement;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    element.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = element.offsetLeft;
      initialY = element.offsetTop;
      element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      element.style.left = `${initialX + dx}px`;
      element.style.top = `${initialY + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'grab';
    });
  }
}
