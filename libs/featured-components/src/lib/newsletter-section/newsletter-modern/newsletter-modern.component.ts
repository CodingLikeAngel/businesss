import { Component, Output, EventEmitter, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIInputComponent, UIButtonComponent } from '@negocio/ui-components';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const newsletterModernVariants = baseVariants;
type NewsletterModernVariantType = typeof newsletterModernVariants[number] | (string & {});

export interface NewsletterModernCustomStyles {
  backgroundColor?: string;
  color?: string;
  '--theme-bg'?: string;
  '--theme-color'?: string;
  '--component-bg'?: string;
  '--component-text'?: string;
  [key: string]: string | undefined;
}

@Component({
  selector: 'lib-ui-newsletter-modern',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './newsletter-modern.component.html',
  styleUrls: ['./newsletter-modern.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UINewsletterModernComponent {
  title = input('Join Our Community');
  description = input('Subscribe to get exclusive content, tips, and updates delivered straight to your inbox.');
  placeholder = input('Your email address');
  buttonText = input('Get Started');
  variant = input<NewsletterModernVariantType>('primary');
  customStyles = input<NewsletterModernCustomStyles>({});

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
      this.successMessage = 'Welcome to the community!';
      this.subscribe.emit(this.email);
      this.email = '';
      setTimeout(() => this.successMessage = '', 3000);
    }, 1000);
  }
}
