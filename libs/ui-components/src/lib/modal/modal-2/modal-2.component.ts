import { Component, input, computed, output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../../models/ui-components-data.model';

export const modal2Variants = variants;
export type Modal2VariantType = typeof modal2Variants[number];

export interface Modal2CustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-modal-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-2.component.html',
  styleUrl: './modal-2.component.scss',
})
export class UIModal2Component implements AfterViewInit {
  variant = input<Modal2VariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Modal Title');
  animationType = input<'fade' | 'slide' | 'scale' | 'none'>('fade');
  resizable = input<boolean>(false);
  content = input<string>('Modal Content');
  isOpen = input<boolean>(false);
  zIndex = input<number>(1000);
  customStyles = input<Modal2CustomStyles>({});
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
    const classes = ['modal-2-container', `modal-2-${this.variant()}`];
    classes.push(`modal-2-rounded-${this.rounded()}`);
    classes.push(`modal-2-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.animationType() !== 'none') classes.push(this.animationType());
    if (this.resizable()) classes.push('resizable');
    return classes.join(' ');
  });

  overlayClasses = computed(() => {
    const classes = ['modal-2-overlay'];
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  headerClasses = computed(() => {
    const classes = ['modal-2-header'];
    classes.push(`header-${this.size()}`);
    return classes.join(' ');
  });

  bodyClasses = computed(() => {
    const classes = ['modal-2-body'];
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
    const modalElement = document.querySelector('.modal-2-container');
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
