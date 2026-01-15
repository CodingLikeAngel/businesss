import { Component, input, computed, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants } from '../models/ui-components-data.model';

export const modalVariants = variants;

export type DefaultModalVariant = typeof modalVariants[number];
export type ModalVariantType = DefaultModalVariant | (string & {});

@Component({
  selector: 'lib-ui-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class UIModalComponent {
  variant = input<ModalVariantType>('secondary');
  rounded = input<'none' | 'md' | 'full'>('md');
  size = input<'sm' | 'md' | 'lg'>('md');
  dark = input<boolean>(false);
  title = input<string>('Modal Title');
  content = input<string>('Modal Content');
  isOpen = input<boolean>(false);
  modalOnClose = output<void>();

  modalClasses = computed(() => {
    const classes = ['modal-container', `modal-${this.variant()}`];
    classes.push(`modal-rounded-${this.rounded()}`);
    classes.push(`modal-${this.size()}`);
    if (this.dark()) classes.push('dark');
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
}
