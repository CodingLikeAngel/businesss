import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-hero-minimal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-minimal" [class]="heroClasses()" [style]="heroStyles()">
      <div class="content-container">
          <div class="pill-badge" *ngIf="badge()">{{ badge() }}</div>
          <h1 class="minimal-title">{{ title() }}</h1>
          <p class="minimal-subtitle">{{ subtitle() }}</p>
          <div class="minimal-actions" *ngIf="showCta()">
            <button class="btn-minimal-primary" (click)="onCtaClick()">{{ ctaLabel() }}</button>
            <button class="btn-minimal-secondary" *ngIf="secondaryCtaLabel()" (click)="onSecondaryCtaClick()">{{ secondaryCtaLabel() }}</button>
          </div>
      </div>
    </section>
  `,
  styleUrl: './hero-minimal.component.scss'
})
export class UIHeroMinimalComponent {
  title = input('Less is More');
  subtitle = input('Minimalist design focuses on the essential, stripping away the unnecessary.');
  badge = input('Introducing');
  variant = input('light');
  ctaLabel = input('Read More');
  secondaryCtaLabel = input('');
  showCta = input(true);
  customStyles = input<Record<string, any>>({});

  ctaClicked = output<void>();
  secondaryCtaClicked = output<void>();

  onCtaClick() { this.ctaClicked.emit(); }
  onSecondaryCtaClick() { this.secondaryCtaClicked.emit(); }

  heroClasses = computed(() => [
    'hero-minimal',
    `variant-${this.variant()}`
  ]);

  heroStyles = computed(() => this.customStyles());
}
