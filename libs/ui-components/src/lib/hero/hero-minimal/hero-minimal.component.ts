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
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .hero-minimal {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 6rem 1.5rem;
      min-height: 50vh;
      text-align: center;
      background: var(--surface-color, #ffffff);
      color: var(--text-color, #1e293b);
      
      &.variant-classic {
          font-family: 'Georgia', serif;
      }
      
      &.variant-dark {
          background: #0f172a;
          color: white;
      }
    }
    
    .content-container {
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }
    
    .pill-badge {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 700;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        background: rgba(99, 102, 241, 0.1);
        color: var(--accent-color, #6366f1);
        border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .minimal-title {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 0;
        
        @media (min-width: 768px) {
            font-size: 5rem;
        }
    }
    
    .minimal-subtitle {
        font-size: 1.25rem;
        opacity: 0.7;
        line-height: 1.6;
        max-width: 600px;
        font-weight: 400;
    }
    
    .minimal-actions {
       display: flex;
       gap: 1rem;
       margin-top: 1rem;
    }
    
    .btn-minimal-primary {
       padding: 0.75rem 2rem;
       border-radius: 50px;
       background: var(--text-color, #1e293b);
       color: var(--surface-color, #ffffff);
       border: none;
       font-weight: 600;
       cursor: pointer;
       transition: transform 0.2s;
       
       &:hover {
           transform: scale(1.05);
       }
       
       .hero-minimal.variant-dark & {
           background: white;
           color: black;
       }
    }
    
    .btn-minimal-secondary {
       padding: 0.75rem 2rem;
       border-radius: 50px;
       background: transparent;
       border: 1px solid rgba(0,0,0,0.1);
       color: inherit;
       font-weight: 600;
       cursor: pointer;
       transition: all 0.2s;
       
       &:hover {
           border-color: currentColor;
       }
       
       .hero-minimal.variant-dark & {
           border-color: rgba(255,255,255,0.2);
       }
    }
  `]
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
