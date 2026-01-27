import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { variants as baseVariants } from '../../models/ui-components-data.model';

const headerVariants = baseVariants;
type HeaderVariantType = typeof headerVariants[number] | (string & {});

@Component({
  selector: 'lib-ui-header-modern',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header [class]="headerClasses()" [style]="headerStyles()">
      <div class="island-container">
        <!-- Logo -->
        <div class="logo">
           <div class="logo-icon"></div>
           <span *ngIf="!logo()">{{ title() }}</span>
           <img *ngIf="logo()" [src]="logo()" [alt]="title()" />
        </div>

        <!-- Navigation -->
        <nav class="nav-modern">
          <a *ngFor="let item of navItems()" [href]="item.href" [class.active]="item.active">
            {{ item.label }}
            <span class="active-dot" *ngIf="item.active"></span>
          </a>
        </nav>

        <!-- Actions -->
        <div class="actions">
            <button class="icon-btn search-btn">🔍</button>
            <button class="cta-modern" *ngIf="ctaLabel()">{{ ctaLabel() }}</button>
            <button class="menu-toggle" (click)="toggleMenu()">☰</button>
        </div>
      </div>
      
       <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" [class.open]="isMenuOpen">
          <button class="close-btn" (click)="toggleMenu()">✕</button>
          <div class="mobile-links">
             <a *ngFor="let item of navItems()" [href]="item.href" (click)="toggleMenu()">{{ item.label }}</a>
          </div>
      </div>
    </header>
  `,
  styleUrl: './header-modern.component.scss'
})
export class UIHeaderModernComponent {
  title = input('Header Modern');
  variant = input<HeaderVariantType>('primary');
  sticky = input(true);
  logo = input<string | null>(null);
  navItems = input<{ label: string; href: string; active?: boolean }[]>([
      { label: 'Platform', href: '#' },
      { label: 'Solutions', href: '#' },
      { label: 'Pricing', href: '#' }
  ]);
  ctaLabel = input<string | null>('Launch App');
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
