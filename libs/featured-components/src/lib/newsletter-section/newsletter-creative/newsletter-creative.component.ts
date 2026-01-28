import { Component, Output, EventEmitter, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent, UIButtonComponent } from '@negocio/ui-components';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const newsletterCreativeVariants = baseVariants;
type NewsletterCreativeVariantType = typeof newsletterCreativeVariants[number] | (string & {});

export interface NewsletterCreativeCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--theme-bg'?: string;
  '--theme-color'?: string;
  '--component-bg'?: string;
  '--component-text'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-newsletter-creative',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './newsletter-creative.component.html',
  styleUrls: ['./newsletter-creative.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UINewsletterCreativeComponent {
  title = input('Never Miss a Beat');
  description = input('Join thousands of subscribers and get exclusive content, early access, and special offers.');
  placeholder = input('Enter your email address');
  buttonText = input('Subscribe Now');
  variant = input<NewsletterCreativeVariantType>('primary');
  customStyles = input<NewsletterCreativeCustomStyles>({});

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
      this.successMessage = 'You\'re all set! 🎉';
      this.subscribe.emit(this.email);
      this.email = '';
      setTimeout(() => this.successMessage = '', 3000);
    }, 1000);
  }
}
