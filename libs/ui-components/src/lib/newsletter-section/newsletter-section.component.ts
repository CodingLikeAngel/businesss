
import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '../forms/input/input.component';
import { UIButtonComponent } from '../button/button.component';

export interface NewsletterCustomStyles {
  backgroundColor?: string;
  color?: string;
  [key: string]: string | undefined;
}

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
  customStyles = input<NewsletterCustomStyles>({});

  newsletterStyles = computed(() => {
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

