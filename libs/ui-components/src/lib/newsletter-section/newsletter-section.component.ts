
import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '../forms/input/input.component';
import { UIButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-ui-newsletter-section',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './newsletter-section.component.html',
  styleUrls: ['./newsletter-section.component.scss']
})
export class UINewsletterSectionComponent {
  title = input('Suscríbete a nuestra Newsletter');
  description = input('Recibe las últimas noticias y ofertas especiales directamente en tu bandeja de entrada.');
  placeholder = input('Tu correo electrónico');
  buttonText = input('Suscribirse');
  variant = input('primary');
  customStyles = input<{[key: string]: string}>({});

  newsletterStyles = computed(() => {
    const styles: any = { ...this.customStyles() };
    if (styles['backgroundColor']) {
      styles['--theme-bg'] = styles['backgroundColor'];
    }
    if (styles['color']) {
      styles['--theme-color'] = styles['color'];
    }
    return styles;
  });
  
  subscribe = output<string>();

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

