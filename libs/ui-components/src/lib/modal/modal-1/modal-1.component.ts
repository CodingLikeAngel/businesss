import { Component, input, computed, output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const modal1Variants = variants;
export type Modal1VariantType = typeof modal1Variants[number];

export interface Modal1CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-modal-1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-1.component.html',
  styleUrl: './modal-1.component.scss',
})
export class UIModal1Component implements AfterViewInit {
  variant = input<Modal1VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Modal Title');
  animationType = input<'fade' | 'slide' | 'scale' | 'none'>('fade');
  resizable = input<boolean>(false);
  content = input<string>('Modal Content');
  isOpen = input<boolean>(false);
  zIndex = input<number>(1000);
  customStyles = input<Modal1CustomStyles>({});
  modalOnClose = output<void>();

  modalStyles = computed(() => {
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

  modalClasses = computed(() => {
    const classes = ['modal-1-container', `modal-1-${this.variant()}`];
    classes.push(`modal-1-rounded-${this.rounded()}`);
    classes.push(`modal-1-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.animationType() !== 'none') classes.push(this.animationType());
    if (this.resizable()) classes.push('resizable');
    return classes.join(' ');
  });

  overlayClasses = computed(() => {
    const classes = ['modal-1-overlay'];
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  headerClasses = computed(() => {
    const classes = ['modal-1-header'];
    classes.push(`header-${this.size()}`);
    return classes.join(' ');
  });

  bodyClasses = computed(() => {
    const classes = ['modal-1-body'];
    classes.push(`body-${this.size()}`);
    return classes.join(' ');
  });

  closeModal() {
    this.modalOnClose.emit();
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.closeModal();
    }
  }

  ngAfterViewInit() {
    if (this.isOpen()) {
      this.trapFocus();
    }
  }

  trapFocus() {
    const modalElement = document.querySelector('.modal-1-container');
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      firstElement.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      };

      modalElement.addEventListener('keydown', handleKeyDown as EventListener);
    }
  }
}
