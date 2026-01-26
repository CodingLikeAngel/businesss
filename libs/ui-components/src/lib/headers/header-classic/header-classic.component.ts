import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const headerVariants = baseVariants;
type HeaderVariantType = typeof headerVariants[number] | (string & {});

@Component({
  selector: 'lib-ui-header-classic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header [class]="headerClasses()" [style]="headerStyles()">
      <div class="header-container">
        <!-- Logo Area -->
        <div class="logo">
          <span *ngIf="!logo()">{{ title() }}</span>
          <img *ngIf="logo()" [src]="logo()" [alt]="title()" />
        </div>

        <!-- Desktop Navigation (Classic: Horizontal List) -->
        <nav class="nav-desktop">
          <ul>
            <li *ngFor="let item of navItems()">
              <a [href]="item.href" [class.active]="item.active">{{ item.label }}</a>
            </li>
          </ul>
        </nav>

        <!-- Right Area (CTA + Mobile Toggle) -->
        <div class="right-area">
            <button class="cta-button" *ngIf="ctaLabel()">{{ ctaLabel() }}</button>
            <button class="menu-toggle" (click)="toggleMenu()">☰</button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMenuOpen">
          <a *ngFor="let item of navItems()" [href]="item.href">{{ item.label }}</a>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
      z-index: 100;
      color: white; /* Default text color for dark themes */
    }

    .header {
      width: 100%;
      padding: 1rem 0;
      transition: all 0.3s ease;
      background: rgba(30, 41, 59, 0.8); /* Default dark background */
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      
      &.is-sticky {
        position: sticky;
        top: 0;
      }

      &.variant-neon {
        border-bottom: 2px solid var(--neon-primary, #00f3ff);
        box-shadow: 0 0 15px rgba(0, 243, 255, 0.2);
        .logo { color: var(--neon-primary, #00f3ff); text-shadow: 0 0 10px rgba(0,243,255,0.5); }
      }

      &.variant-glass {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      &.variant-dark {
        background: #000;
        color: white;
      }
      
      &.variant-professional {
         background: white;
         color: #333;
         .logo { color: #1a1a1a; font-weight: 800; }
         a { color: #444; &:hover { color: var(--primary-color, blue); } }
      }
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: inherit;
    }

    .nav-desktop {
      display: none;
      @media (min-width: 768px) {
        display: block;
      }
      
      ul {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
        
        a {
            text-decoration: none;
            color: inherit;
            font-weight: 500;
            opacity: 0.8;
            transition: opacity 0.2s;
            &:hover { opacity: 1; }
            &.active { opacity: 1; font-weight: 700; }
        }
      }
    }

    .right-area {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .cta-button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        background: var(--accent-color, #6366f1);
        color: white;
        cursor: pointer;
        font-weight: 600;
    }
    
    .menu-toggle {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        @media (min-width: 768px) { display: none; }
    }

    .mobile-menu {
        display: none;
        padding: 1rem;
        background: inherit;
        flex-direction: column;
        gap: 1rem;
        &.open { display: flex; }
        a { text-decoration: none; color: inherit; padding: 0.5rem; }
    }
  `]
})
export class UIHeaderClassicComponent {
  title = input('Header Classic');
  variant = input<HeaderVariantType>('primary');
  sticky = input(true);
  logo = input<string | null>(null);
  navItems = input<{ label: string; href: string; active?: boolean }[]>([
      { label: 'Inicio', href: '#' },
      { label: 'Servicios', href: '#' },
      { label: 'Contacto', href: '#' }
  ]);
  ctaLabel = input<string | null>('Empezar');
  customStyles = input<Record<string, any>>({});

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  headerClasses = computed(() => [
    'header',
    `variant-${this.variant()}`,
    this.sticky() ? 'is-sticky' : '',
  ].filter(Boolean));

  headerStyles = computed(() => {
    return this.customStyles();
  });
}
