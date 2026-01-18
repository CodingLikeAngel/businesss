
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '../forms/input/input.component';
import { UIButtonComponent } from '../button/button.component';

export interface NewsletterCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--theme-bg'?: string;
  '--theme-color'?: string;
  '--component-bg'?: string;
  '--component-text'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-newsletter-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './newsletter-section.component.html',
  styleUrls: ['./newsletter-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UINewsletterSectionComponent {
  @Input() title = 'Suscríbete a nuestra Newsletter';
  @Input() description = 'Recibe las últimas noticias y ofertas especiales directamente en tu bandeja de entrada.';
  @Input() placeholder = 'Tu correo electrónico';
  @Input() buttonText = 'Suscribirse';
  @Input() variant = 'primary';
  @Input() customStyles: NewsletterCustomStyles = {};

  @Output() subscribe = new EventEmitter<string>();

  get newsletterStyles() {
    const styles: Record<string, any> = {};

    if (this.customStyles['backgroundColor']) {
      styles['--theme-bg'] = this.customStyles['backgroundColor'];
      styles['--component-bg'] = this.customStyles['backgroundColor'];
      styles['background'] = this.customStyles['backgroundColor'];
      styles['background-color'] = this.customStyles['backgroundColor'];
    }

    if (this.customStyles['color']) {
      styles['--theme-color'] = this.customStyles['color'];
      styles['--component-text'] = this.customStyles['color'];
      styles['color'] = this.customStyles['color'];
    }

    if (this.customStyles['--theme-bg']) {
      styles['--theme-bg'] = this.customStyles['--theme-bg'];
    }

    if (this.customStyles['--theme-color']) {
      styles['--theme-color'] = this.customStyles['--theme-color'];
    }

    if (this.customStyles['--component-bg']) {
      styles['--component-bg'] = this.customStyles['--component-bg'];
    }

    if (this.customStyles['--component-text']) {
      styles['--component-text'] = this.customStyles['--component-text'];
    }

    Object.keys(this.customStyles).forEach(key => {
      if (key !== 'backgroundColor' && key !== 'color' && key !== '--theme-bg' && key !== '--theme-color' && key !== '--component-bg' && key !== '--component-text') {
        styles[key] = this.customStyles[key];
      }
    });

    return styles;
  }

  email = '';
  isSubmitting = false;
  successMessage = '';

  onSubmit() {
    if (!this.email) return;
    this.isSubmitting = true;
    
    setTimeout(() => {
        this.isSubmitting = false;
        this.successMessage = '¡Gracias por suscribirte!';
        this.subscribe.emit(this.email);
        this.email = '';
        setTimeout(() => this.successMessage = '', 3000);
    }, 1000);
  }
}

