
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UIButtonComponent } from '../button/button.component';
import { UIInputComponent } from '../forms/input/input.component';
import { variants } from '../models/ui-components-data.model';



@Component({
  selector: 'lib-ui-contact-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class UIContactSectionComponent {
  variant = input('primary');
  title = input('Contáctanos');
  subtitle = input('Estamos aquí para ayudarte. Envíanos un mensaje.');
  emailLabel = input('Email');
  messageLabel = input('Mensaje');
  buttonText = input('Enviar Mensaje');
  
  formSubmit = output<any>();

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

