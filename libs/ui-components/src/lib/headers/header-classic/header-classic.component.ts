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
  styleUrl: './header-classic.component.scss'
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
