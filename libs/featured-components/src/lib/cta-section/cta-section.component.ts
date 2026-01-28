import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIButtonComponent } from '@negocio/ui-components';

@Component({
  selector: 'lib-ui-cta-section',
  standalone: true,
  imports: [CommonModule, UIButtonComponent],
  template: `
    <section class="cta-section" [ngClass]="['cta--' + variant()]">
      <div class="container">
        <h2 class="cta-title">{{ title() }}</h2>
        <p class="cta-description">{{ description() }}</p>
        <div class="cta-actions">
          <lib-ui-components-button 
            [variant]="btnVariant()" 
            [size]="'lg'" 
            (click)="onCtaClick()">
            {{ ctaLabel() }}
          </lib-ui-components-button>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./cta-section.component.scss']
})
export class CTASectionComponent {
  title = input('¿Listo para dar el siguiente paso?');
  description = input('Únete a nosotros y transforma tu negocio con soluciones de vanguardia.');
  ctaLabel = input('Empezar Ahora');
  variant = input('primary');
  btnVariant = input('secondary');

  ctaClicked = output<void>();

  onCtaClick() {
    this.ctaClicked.emit();
  }
}
