import { Component, input, computed, output, EventEmitter, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../models/ui-components-data.model';
import { mergeCustomStyles } from '../models/merge-custom-styles.util';

export const modalVariants = variants;

export type DefaultModalVariant = typeof modalVariants[number];
export type ModalVariantType = DefaultModalVariant | (string & {});

export interface ModalCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-components-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UIModalComponent implements AfterViewInit {
  variant = input<ModalVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Modal Title');
  animationType = input<'fade' | 'slide' | 'scale' | 'none'>('fade');
  resizable = input<boolean>(false);
  content = input<string>('Modal Content');
  isOpen = input<boolean>(false);
  zIndex = input<number>(1000);
  customStyles = input<ModalCustomStyles>({});
  modalOnClose = output<void>();

  modalStyles = computed(() => mergeCustomStyles(this.customStyles(), 'modal'));

  modalClasses = computed(() => {
    const classes = ['modal-container', `modal-${this.variant()}`];
    classes.push(`modal-rounded-${this.rounded()}`);
    classes.push(`modal-${this.size()}`);
    if (this.dark()) classes.push('dark');
    if (this.animationType() !== 'none') classes.push(this.animationType());
    if (this.resizable()) classes.push('resizable');
    return classes.join(' ');
  });

  overlayClasses = computed(() => {
    const classes = ['modal-overlay'];
    if (this.dark()) classes.push('dark');
    return classes.join(' ');
  });

  headerClasses = computed(() => {
    const classes = ['modal-header'];
    classes.push(`header-${this.size()}`);
    return classes.join(' ');
  });

  bodyClasses = computed(() => {
    const classes = ['modal-body'];
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
    const modalElement = document.querySelector('.modal-container');
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
