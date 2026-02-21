import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIButtonComponent, UIInputComponent, UITitleComponent } from '@negocio/ui-components';
import { applySectionStyles } from '../utils/section-styles.util';
import type { CustomStyles } from '../models/custom-styles.interface';

export interface ContactItem {
  icon: string;
  title: string;
  value: string;
  link?: string;
  linkText?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'lib-ui-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent, UITitleComponent],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class UIContactSectionComponent {
  variant = input('primary');
  title = input('¡Contáctanos!');
  subtitle = input('Cuéntanos tu proyecto y te ayudaremos a hacerlo realidad.');
  infoTitle = input('Información de Contacto');
  contactItems = input<ContactItem[]>([
    { icon: '📧', title: 'Email', value: 'info@empresa.com', link: 'mailto:info@empresa.com', linkText: 'Enviar email' },
    { icon: '📞', title: 'Teléfono', value: '+34 900 123 456', link: 'tel:+34900123456', linkText: 'Llamar ahora' },
    { icon: '📍', title: 'Dirección', value: 'Calle Principal 123, Ciudad', link: 'https://maps.google.com', linkText: 'Ver en mapa' }
  ]);

  buttonText = input('Enviar Mensaje');
  customStyles = input<CustomStyles>({});

  contactStyles = computed(() => applySectionStyles(this.customStyles()));

  formSubmit = output<{ name: string; email: string; message: string }>();

  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  formError = signal<string | null>(null);

  validateForm(): boolean {
    const { name, email, message } = this.formData;
    if (!name?.trim()) {
      this.formError.set('Introduce tu nombre.');
      return false;
    }
    if (!email?.trim()) {
      this.formError.set('Introduce tu email.');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      this.formError.set('Introduce un email válido.');
      return false;
    }
    if (!message?.trim()) {
      this.formError.set('Escribe tu mensaje.');
      return false;
    }
    this.formError.set(null);
    return true;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    this.formError.set(null);
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = '¡Mensaje enviado con éxito!';
      this.formSubmit.emit({ ...this.formData });
      this.resetForm();
    }, 1500);
  }

  resetForm(): void {
    this.formData = { name: '', email: '', message: '' };
    this.formError.set(null);
    setTimeout(() => (this.successMessage = ''), 3000);
  }
}

