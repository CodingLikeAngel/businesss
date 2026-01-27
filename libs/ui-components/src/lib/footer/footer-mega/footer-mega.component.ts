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
  styleUrl: './footer-mega.component.scss'
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
