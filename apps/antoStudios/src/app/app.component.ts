import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UISpinnerComponent } from '@negocio/ui-components';
import { LoadingService } from '@negocio/shared-components';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, UISpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  loading = computed(() => this.loadingService.loading());
  currentTheme: 'dark' | 'light' = 'dark';

  ngOnInit() {
    // Initialize theme
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      this.currentTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      this.applyTheme();
    }

    // Metadatos por defecto
    this.titleService.setTitle('Anto Studios - Webs Profesionales a Medida');
    this.metaService.updateTag({
      name: 'description',
      content: 'Crea tu web profesional con Anto Studios. Diseños a medida, rápidos y optimizados para tu negocio.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'webs profesionales, diseño web, desarrollo web, Anto Studios',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Anto Studios - Webs Profesionales a Medida',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: 'Soluciones web personalizadas para escalar tu negocio con Anto Studios.',
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://antostudios.com/assets/og-image.jpg',
    });

  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.currentTheme);
    }
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.className = this.currentTheme;
    }
  }
}
