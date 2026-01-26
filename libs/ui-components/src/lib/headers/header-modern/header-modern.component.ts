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
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
      z-index: 100;
      padding-top: 1.5rem; /* Space for the floating island */
      pointer-events: none; /* Let clicks pass through outside island */
    }

    .header {
      width: 100%;
      display: flex;
      justify-content: center;
      transition: all 0.3s ease;
      
      &.is-sticky {
        position: sticky;
        top: 1.5rem;
      }
    }

    .island-container {
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      max-width: 1000px;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
        background: rgba(30, 41, 59, 0.85);
      }
    }

    /* Variants affecting the island */
    .variant-neon .island-container {
        border: 1px solid var(--neon-primary, #00f3ff);
        box-shadow: 0 0 20px rgba(0, 243, 255, 0.15);
    }

    .variant-glass .island-container {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .variant-professional .island-container {
        background: white;
        color: #1e293b;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        .logo { color: #0f172a; }
        .nav-modern a { color: #64748b; &:hover { color: #0f172a; } }
        .cta-modern { background: #0f172a; color: white; }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 800;
      font-size: 1.25rem;
      color: white;
      letter-spacing: -0.02em;
    }
    
    .logo-icon {
        width: 24px;
        height: 24px;
        background: currentColor;
        border-radius: 8px;
        opacity: 0.2;
    }

    .nav-modern {
      display: none;
      @media (min-width: 768px) {
        display: flex;
        gap: 0.5rem;
      }
      
      a {
        text-decoration: none;
        color: rgba(255,255,255,0.7);
        font-weight: 600;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        transition: all 0.2s;
        position: relative;
        
        &:hover {
            color: white;
            background: rgba(255,255,255,0.05);
        }
        
        &.active {
            color: white;
            background: rgba(255,255,255,0.1);
        }
      }
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .icon-btn {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.1rem;
        cursor: pointer;
        opacity: 0.7;
        &:hover { opacity: 1; }
    }

    .cta-modern {
        background: white;
        color: #0f172a;
        border: none;
        padding: 0.6rem 1.25rem;
        border-radius: 30px;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
            transform: scale(1.05);
        }
        
        .variant-neon & {
            background: var(--neon-primary, #00f3ff);
            box-shadow: 0 0 10px var(--neon-primary, #00f3ff);
        }
    }
    
    .menu-toggle {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        @media (min-width: 768px) { display: none; }
    }
    
    .mobile-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        z-index: 200;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        
        &.open {
            opacity: 1;
            pointer-events: auto;
        }
        
        .close-btn {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        
        .mobile-links {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            text-align: center;
            
            a {
                color: white;
                text-decoration: none;
                font-size: 2rem;
                font-weight: 800;
                
                &:hover {
                    color: var(--accent-color, #6366f1);
                }
            }
        }
    }
  `]
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
