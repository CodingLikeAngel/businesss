import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ForestAnimationComponent,
  UIDeepFooterComponent,
  UIFooterComponent,
  UIHeaderComponent,
  UIVideogamesFooterComponent,
  VideogameVariant,
} from '@negocio/ui-components';
import { VariantRotationService, VariantService } from '@negocio/shared-components'; // Asegúrate de importar VariantService
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterConfig } from '@negocio/shared-components'; // Importa la interfaz FooterConfig

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, UIHeaderComponent, UIFooterComponent, UIVideogamesFooterComponent, UIDeepFooterComponent, ForestAnimationComponent],
})
export class AppComponent {
  currentVariant = 'electoon';
  footerConfig: FooterConfig; // Estado dinámico para el footer
  videogamesFooterConfig: FooterConfig; // Configuración para videogamesFooter
  deepFooterConfig = {
    theme: 'theme-mario',
  };

  private videogameVariants: VideogameVariant[] = [
    'arcade', 'neon-grid', 'pixel-adventure', 'cosmic', 'fantasy-realm',
    // ... resto de variantes
  ];

  private deepFooterThemes: string[] = [
    'theme-mario', 'theme-zelda', 'theme-rayman',
    // ... resto de temas
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private variantRotationService: VariantRotationService,
    private variantService: VariantService // Inyecta VariantService
  ) {
    // Inicializar footerConfig con el valor actual
    this.footerConfig = this.variantService.getCurrentFooterConfig();
    this.videogamesFooterConfig = { ...this.footerConfig, variant: 'arcade' };

    if (isPlatformBrowser(this.platformId)) {
      // Suscribirse a cambios en currentVariant
      this.variantRotationService.startRotation();
      this.variantRotationService.currentVariant$
        .pipe(takeUntilDestroyed())
        .subscribe(variant => {
          this.currentVariant = variant;
        });

      // Suscribirse a cambios en footerConfig
      this.variantService.footerConfig$
        .pipe(takeUntilDestroyed())
        .subscribe(config => {
          this.footerConfig = config;
          // Actualizar videogamesFooterConfig manteniendo la variante rotativa
          this.videogamesFooterConfig = {
            ...config,
            variant: this.videogamesFooterConfig.variant, // Conservar la variante rotativa
          };
        });

      // Iniciar rotación para deepFooter y videogamesFooter
      this.startFooterRotation();
    }
  }

  private startFooterRotation() {
    let videogameIndex = 0;
    let deepFooterIndex = 0;

    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        // Rotar videogamesFooter variant
        const variant = this.videogameVariants[videogameIndex];
        this.videogamesFooterConfig = {
          ...this.footerConfig,
          variant: variant as VideogameVariant,
        };
        videogameIndex = (videogameIndex + 1) % this.videogameVariants.length;

        // Rotar deepFooter theme
        const theme = this.deepFooterThemes[deepFooterIndex];
        this.deepFooterConfig = {
          ...this.deepFooterConfig,
          theme: theme,
        };
        deepFooterIndex = (deepFooterIndex + 1) % this.deepFooterThemes.length;
      });
  }

  onLinkClick($event: string) {
    console.log('Link clicked:', $event); // Implementar lógica según necesidad
  }

  onSocialClick($event: string) {
    console.log('Social clicked:', $event); // Implementar lógica según necesidad
  }

  title = 'foro-leon-test';
}