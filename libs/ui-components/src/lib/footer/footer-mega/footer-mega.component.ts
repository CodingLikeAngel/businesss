import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-footer-mega',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-mega" [class]="footerClasses()" [style]="footerStyles()">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
           <h2 class="mega-title">{{ title() }}</h2>
           <p class="mega-desc">{{ description() }}</p>
           <div class="social-row">
             <a *ngFor="let icon of socialIcons()" [href]="icon.href" class="social-circle">
                <span *ngIf="icon.name === 'twitter'">🐦</span>
                <span *ngIf="icon.name === 'facebook'">📘</span>
                <span *ngIf="icon.name === 'instagram'">📷</span>
                <span *ngIf="icon.name === 'linkedin'">💼</span>
             </a>
           </div>
        </div>
        
        <!-- Links Columns -->
        <div class="footer-col" *ngFor="let group of linkGroups()">
            <h3 class="col-title">{{ group.title }}</h3>
            <ul class="link-list">
                <li *ngFor="let link of group.links">
                    <a [href]="link.href">{{ link.label }}</a>
                </li>
            </ul>
        </div>
        
        <!-- Newsletter Column -->
        <div class="footer-col newsletter-col" *ngIf="showNewsletter()">
            <h3 class="col-title">Stay Updated</h3>
            <p class="news-desc">Join our newsletter for the latest updates.</p>
            <div class="news-form">
                <input type="email" placeholder="Enter your email" class="news-input" />
                <button class="news-btn">→</button>
            </div>
        </div>
      </div>
      
      <div class="footer-bottom">
         <p>{{ copyright() }}</p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .footer-mega {
      padding: 5rem 2rem 2rem;
      background: var(--surface-color, #0f172a);
      color: var(--text-color, #94a3b8);
      font-size: 0.95rem;
      
      &.variant-light {
          background: #f8fafc;
          color: #475569;
          
          .mega-title, .col-title { color: #0f172a; }
          .news-input { 
              background: white; 
              border: 1px solid #e2e8f0;
              color: #0f172a;
          }
      }

      &.variant-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      &.variant-neon {
          background: #0a0a0a;
          border-top: 1px solid var(--neon-primary, #00f3ff);
          box-shadow: 0 -4px 20px rgba(0, 243, 255, 0.1);
          
          .mega-title {
              color: var(--neon-primary, #00f3ff);
              text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
          }
          
          .social-circle:hover {
              background: var(--neon-primary, #00f3ff);
              box-shadow: 0 0 15px var(--neon-primary, #00f3ff);
          }
      }

      &.variant-cyberpunk {
          background: #000;
          border-top: 2px solid #facc15;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          
          .mega-title {
              color: #facc15;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-family: 'Courier New', monospace;
          }
          
          .news-btn {
              background: #facc15;
              color: black;
              border-radius: 0;
              font-weight: bold;
              
              &:hover {
                  box-shadow: 4px 4px 0 #fff;
                  transform: translate(-2px, -2px);
              }
          }
      }
    }
    
    .footer-grid {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
      margin-bottom: 4rem;
    }
    
    .brand-col {
       grid-column: span 1;
       @media(min-width: 1024px) {
           grid-column: span 2;
       }
    }
    
    .mega-title {
        font-size: 1.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: white;
    }
    
    .mega-desc {
        line-height: 1.6;
        margin-bottom: 1.5rem;
        max-width: 300px;
    }
    
    .col-title {
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        color: white;
        margin-bottom: 1.5rem;
    }
    
    .link-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        
        a {
            text-decoration: none;
            color: inherit;
            transition: color 0.2s;
            
            &:hover {
                color: var(--accent-color, #6366f1);
            }
        }
    }
    
    .social-row {
        display: flex;
        gap: 0.75rem;
    }
    
    .social-circle {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all 0.2s;
        
        &:hover {
            background: var(--accent-color, #6366f1);
            color: white;
            transform: translateY(-3px);
        }
    }
    
    .newsletter-col {
        min-width: 250px;
    }
    
    .news-desc {
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    
    .news-form {
        display: flex;
        gap: 0.5rem;
    }
    
    .news-input {
        flex: 1;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        
        &:focus {
            outline: none;
            border-color: var(--accent-color, #6366f1);
        }
    }
    
    .news-btn {
        width: 3rem;
        border-radius: 0.5rem;
        background: var(--accent-color, #6366f1);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        
        &:hover {
            filter: brightness(1.1);
        }
    }
    
    .footer-bottom {
        max-width: 1280px;
        margin: 0 auto;
        padding-top: 2rem;
        border-top: 1px solid rgba(255,255,255,0.1);
        text-align: center;
        font-size: 0.85rem;
        opacity: 0.6;
    }
  `]
})
export class UIFooterMegaComponent {
  title = input('Mega Corp');
  description = input('Innovative solutions for the modern world. We build the future today.');
  copyright = input('© 2024 Mega Corp. All rights reserved.');
  socialIcons = input<{name: string, href: string}[]>([
      { name: 'twitter', href: '#' },
      { name: 'facebook', href: '#' },
      { name: 'instagram', href: '#' }
  ]);
  
  linkGroups = input<{title: string, links: {label: string, href: string}[]}[]>([
      { 
          title: 'Product', 
          links: [
              { label: 'Features', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Integrations', href: '#' }
          ]
      },
      { 
          title: 'Company', 
          links: [
              { label: 'About', href: '#' },
              { label: 'Careers', href: '#' },
              { label: 'Blog', href: '#' }
          ]
      },
      { 
          title: 'Support', 
          links: [
              { label: 'Documentation', href: '#' },
              { label: 'Help Center', href: '#' },
              { label: 'Contact', href: '#' }
          ]
      }
  ]);
  
  showNewsletter = input(true);
  variant = input('dark');
  customStyles = input<Record<string, any>>({});
  
  footerClasses = computed(() => ['footer-mega', `variant-${this.variant()}`]);
  footerStyles = computed(() => this.customStyles());
}
