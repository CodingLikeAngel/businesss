import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-hero-split',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-split" [class]="heroClasses()" [style]="heroStyles()">
      <div class="split-container">
        <!-- Text Side -->
        <div class="split-content">
          <h1 class="split-title">{{ title() }}</h1>
          <p class="split-subtitle">{{ subtitle() }}</p>
          <div class="split-actions" *ngIf="showCta()">
            <button class="btn-primary" (click)="onCtaClick()">{{ ctaLabel() }}</button>
            <button class="btn-secondary" *ngIf="secondaryCtaLabel()" (click)="onSecondaryCtaClick()">{{ secondaryCtaLabel() }}</button>
          </div>
        </div>

        <!-- Visual Side -->
        <div class="split-visual">
          <img *ngIf="image()" [src]="image()" [alt]="title()" class="hero-image" />
          <div *ngIf="!image()" class="placeholder-visual">
             <div class="icon-visual">{{ icon() }}</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero-split.component.scss'
})
export class UIHeroSplitComponent {
  title = input('Hero Split Title');
  subtitle = input('Subtitle description for the split hero layout.');
  variant = input('glass');
  ctaLabel = input('Get Started');
  secondaryCtaLabel = input('');
  showCta = input(true);
  image = input<string | null>(null);
  icon = input('🚀');
  customStyles = input<Record<string, any>>({});

  ctaClicked = output<void>();
  secondaryCtaClicked = output<void>();

  onCtaClick() { this.ctaClicked.emit(); }
  onSecondaryCtaClick() { this.secondaryCtaClicked.emit(); }

  heroClasses = computed(() => [
    'hero-split',
    `variant-${this.variant()}`
  ]);

  heroStyles = computed(() => this.customStyles());
}
