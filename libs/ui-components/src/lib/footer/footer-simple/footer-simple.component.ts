import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-components-footer-simple',
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
  styleUrl: './footer-simple.component.scss'
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
