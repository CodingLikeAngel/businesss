import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UICardPremiumComponent,
  UIChipComponent,
  UITooltipComponent,
  CardVariant,
  CardPremiumConfig
} from '@negocio/ui-components';

@Component({
  selector: 'lib-promotions-section',
  standalone: true,
  imports: [
    CommonModule,
    UICardPremiumComponent,
    UIChipComponent,
    UITooltipComponent
  ],
  template: `
    <!-- Sección de Promociones -->
    <section id="promociones" class="mb-16">
      <div class="container mx-auto px-4">
        <h2
          class="text-4xl font-bold text-[#FACC15] text-center mb-8 md:mb-12 font-nintendo drop-shadow-[0_4px_8px_rgba(255,204,21,0.8)] animate-bounce"
        >
          Ofertas Especiales
        </h2>

        <p class="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Descubre nuestras promociones exclusivas y ahorra en tus tratamientos favoritos.
        </p>
      </div>

      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Promoción 1 -->
          <div class="relative mt-12">
            <lib-ui-components-chip
              [variant]="selectedVariant"
              size="sm"
              rounded="full"
              class="absolute md:top-[-2.5rem] top-[-1.5rem] left-1/2 transform -translate-x-1/2 z-20 text-white md:px-4 px-3 md:py-1 py-0.5 shadow-md font-semibold"
            >
              ¡-20%!
            </lib-ui-components-chip>

            <lib-ui-components-tooltip
              [content]="'¡Ahorra con este combo especial!'"
              [variant]="selectedVariant"
              position="top"
            >
              <lib-ui-components-card-premium
                [variant]="selectedVariant"
                [config]="premiumCardConfigs[0]"
              ></lib-ui-components-card-premium>
            </lib-ui-components-tooltip>
          </div>

          <!-- Promoción 2 -->
          <div class="relative mt-12">
            <lib-ui-components-chip
              [variant]="selectedVariant"
              size="sm"
              rounded="full"
              class="absolute md:top-[-2.5rem] top-[-1.5rem] left-1/2 transform -translate-x-1/2 z-20 text-white md:px-4 px-3 md:py-1 py-0.5 shadow-md font-semibold"
            >
              ¡Oferta!
            </lib-ui-components-chip>

            <lib-ui-components-tooltip
              [content]="'Manicura de larga duración.'"
              [variant]="selectedVariant"
              position="top"
            >
              <lib-ui-components-card-premium
                [variant]="selectedVariant"
                [config]="premiumCardConfigs[1]"
              ></lib-ui-components-card-premium>
            </lib-ui-components-tooltip>
          </div>

          <!-- Promoción 3 -->
          <div class="relative mt-12">
            <lib-ui-components-chip
              [variant]="selectedVariant"
              size="sm"
              rounded="full"
              class="absolute md:top-[-2.5rem] top-[-1.5rem] left-1/2 transform -translate-x-1/2 z-20 text-white md:px-4 px-3 md:py-1 py-0.5 shadow-md font-semibold"
            >
              ¡Novedad!
            </lib-ui-components-chip>

            <lib-ui-components-tooltip
              [content]="'Revitaliza tu cabello hoy.'"
              [variant]="selectedVariant"
              position="top"
            >
              <lib-ui-components-card-premium
                [variant]="selectedVariant"
                [config]="premiumCardConfigs[2]"
              ></lib-ui-components-card-premium>
            </lib-ui-components-tooltip>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .container {
        max-width: 1200px;
      }

      .font-nintendo {
        font-family: 'Press Start 2P', cursive;
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }
      }
    `
  ]
})
export class PromotionsSectionComponent implements OnInit {
  @Input() variant: CardVariant = 'default';
  @Input() premiumCardConfigs: CardPremiumConfig[] = [];
  @Input() selectedVariant: CardVariant | string = 'primary';

  ngOnInit(): void {
    const defaultCard: CardPremiumConfig = {
      title: 'Promoción',
      description: 'Descripción de la oferta especial.',
      image: '',
      price: '0€',
      discount: '0%',
      icon: 'heroStar',
      tooltip: ''
    };

    if (!Array.isArray(this.premiumCardConfigs)) {
      this.premiumCardConfigs = [];
    }

    while (this.premiumCardConfigs.length < 3) {
      this.premiumCardConfigs.push({ ...defaultCard });
    }

    this.premiumCardConfigs = this.premiumCardConfigs.map((config, index) => ({
      ...defaultCard,
      ...config,
      tooltip:
        config.tooltip ||
        (index === 0
          ? '¡Ahorra con este combo especial!'
          : index === 1
          ? 'Manicura de larga duración.'
          : 'Revitaliza tu cabello hoy.')
    }));
  }
}
