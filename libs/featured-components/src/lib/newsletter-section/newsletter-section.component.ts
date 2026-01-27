import { Component, Output, EventEmitter, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent } from '../forms/input/input.component';
import { UIButtonComponent } from '../button/button.component';
import { UINewsletterMinimalComponent } from './newsletter-minimal/newsletter-minimal.component';
import { UINewsletterModernComponent } from './newsletter-modern/newsletter-modern.component';
import { UINewsletterCreativeComponent } from './newsletter-creative/newsletter-creative.component';
import { variants as baseVariants } from '../models/ui-components-data.model';

const newsletterVariants = baseVariants;
type NewsletterVariantType = typeof newsletterVariants[number] | (string & {});

export type NewsletterSubtype = 'classic' | 'minimal' | 'modern' | 'creative';

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
  imports: [
    CommonModule,
    FormsModule,
    UIInputComponent,
    UIButtonComponent,
    UINewsletterMinimalComponent,
    UINewsletterModernComponent,
    UINewsletterCreativeComponent
  ],
  templateUrl: './newsletter-section.component.html',
  styleUrls: ['./newsletter-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UINewsletterSectionComponent {
  title = input('Suscríbete a nuestra Newsletter');
  description = input('Recibe las últimas noticias y ofertas especiales directamente en tu bandeja de entrada.');
  placeholder = input('Tu correo electrónico');
  buttonText = input('Suscribirse');
  variant = input<NewsletterVariantType>('primary');
  subtype = input<NewsletterSubtype>('classic');
  customStyles = input<NewsletterCustomStyles>({});

  @Output() subscribe = new EventEmitter<string>();

  newsletterStyles = computed(() => {
    const styles: Record<string, any> = {};
    const config = this.customStyles();

    if (config['backgroundColor']) {
      styles['--theme-bg'] = config['backgroundColor'];
      styles['--component-bg'] = config['backgroundColor'];
      styles['background'] = config['backgroundColor'];
      styles['background-color'] = config['backgroundColor'];
    }

    if (config['color']) {
      styles['--theme-color'] = config['color'];
      styles['--component-text'] = config['color'];
      styles['color'] = config['color'];
    }

    Object.keys(config).forEach(key => {
      if (!['backgroundColor', 'color'].includes(key)) {
        styles[key] = config[key];
      }
    });

    return styles;
  });

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
