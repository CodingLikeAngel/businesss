import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-footer-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-simple" [class]="footerClasses()" [style]="footerStyles()">
      <div class="footer-container">
        <div class="footer-brand">
             <span class="brand-name">{{ title() }}</span>
             <span class="copyright">{{ copyright() }}</span>
        </div>
        
        <div class="footer-links">
             <a *ngFor="let link of links()" [href]="link.href" class="footer-link">{{ link.label }}</a>
        </div>
        
        <div class="social-icons" *ngIf="socialIcons().length > 0">
             <a *ngFor="let icon of socialIcons()" [href]="icon.href" class="social-icon">
                <!-- Simple placeholder icons -->
                <span *ngIf="icon.name === 'twitter'">🐦</span>
                <span *ngIf="icon.name === 'facebook'">📘</span>
                <span *ngIf="icon.name === 'instagram'">📷</span>
                <span *ngIf="icon.name === 'linkedin'">💼</span>
             </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .footer-simple {
      padding: 2rem;
      background: var(--surface-color, #ffffff);
      color: var(--text-color, #64748b);
      border-top: 1px solid rgba(0,0,0,0.05);
      
      &.variant-dark {
         background: #0f172a;
         color: #94a3b8;
         border-top: 1px solid rgba(255,255,255,0.05);
      }

      &.variant-light {
         background: #f8fafc;
         color: #475569;
         border-top: 1px solid #e2e8f0;
         .brand-name { color: #0f172a; }
      }

      &.variant-glass {
         background: rgba(255, 255, 255, 0.05);
         backdrop-filter: blur(10px);
         border-top: 1px solid rgba(255, 255, 255, 0.1);
         color: white;
         .brand-name { color: white; }
      }

      &.variant-neon {
         background: black;
         border-top: 1px solid var(--neon-primary, #00f3ff);
         box-shadow: 0 -4px 15px rgba(0, 243, 255, 0.1);
         .brand-name { color: var(--neon-primary, #00f3ff); text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
      }
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      
      @media (min-width: 768px) {
         flex-direction: row;
         justify-content: space-between;
      }
    }
    
    .footer-brand {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 0.25rem;
       
       @media (min-width: 768px) {
           align-items: flex-start;
       }
    }
    
    .brand-name {
       font-weight: 700;
       color: var(--text-primary, #0f172a);
       
       .footer-simple.variant-dark & {
           color: white;
       }
    }
    
    .copyright {
       font-size: 0.8rem;
       opacity: 0.8;
    }
    
    .footer-links {
        display: flex;
        gap: 1.5rem;
        
        .footer-link {
            text-decoration: none;
            color: inherit;
            font-size: 0.9rem;
            transition: color 0.2s;
            
            &:hover {
                color: var(--accent-color, #6366f1);
            }
        }
    }
    
    .social-icons {
        display: flex;
        gap: 1rem;
        
        .social-icon {
            text-decoration: none;
            font-size: 1.2rem;
            opacity: 0.7;
            transition: opacity 0.2s;
            
            &:hover {
                opacity: 1;
            }
        }
    }
  `]
})
export class UIFooterSimpleComponent {
  title = input('Company Name');
  copyright = input('© 2024 All rights reserved.');
  links = input<{label: string, href: string}[]>([
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Contact', href: '#' }
  ]);
  socialIcons = input<{name: string, href: string}[]>([
      { name: 'twitter', href: '#' },
      { name: 'instagram', href: '#' }
  ]);
  variant = input('light');
  customStyles = input<Record<string, any>>({});
  
  footerClasses = computed(() => ['footer-simple', `variant-${this.variant()}`]);
  footerStyles = computed(() => this.customStyles());
}
