
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UIButtonComponent } from '../button/button.component';
import { UIInputComponent } from '../forms/input/input.component';
import { variants } from '../models/ui-components-data.model';

export type ContactVariant = typeof variants[number];

@Component({
  selector: 'lib-ui-components-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class UIContactSectionComponent {
  @Input() variant: ContactVariant = 'primary';
  @Input() title = 'Contáctanos';
  @Input() subtitle = 'Estamos aquí para ayudarte. Envíanos un mensaje.';
  @Input() emailLabel = 'Email';
  @Input() messageLabel = 'Mensaje';
  @Input() buttonText = 'Enviar Mensaje';
  
  @Output() formSubmit = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';

  onSubmit() {
    this.isSubmitting = true;
    // Simulate API call or emit event
    setTimeout(() => {
        this.isSubmitting = false;
        this.successMessage = '¡Mensaje enviado con éxito!';
        this.formSubmit.emit(this.formData);
        this.resetForm();
    }, 1500);
  }

  resetForm() {
      this.formData = {
          name: '',
          email: '',
          message: ''
      };
      setTimeout(() => this.successMessage = '', 3000);
  }
}
