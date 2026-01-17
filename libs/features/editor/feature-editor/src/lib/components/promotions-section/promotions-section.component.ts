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
    <section class="promotions-wrapper py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 tracking-tight">
            {{ title }}
          </h2>
          <p class="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            {{ description }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div *ngFor="let config of premiumCardConfigs; let i = index" class="promo-item relative group">
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 z-30 transition-transform group-hover:scale-110">
              <lib-ui-components-chip
                [variant]="selectedVariant"
                size="md"
                rounded="full"
                class="shadow-[0_0_20px_rgba(24ACC15,0.4)] border border-white/20"
              >
                {{ config.discount || 'OFERTA' }}
              </lib-ui-components-chip>
            </div>

            <lib-ui-components-tooltip
              [content]="config.tooltip || '¡Aprovéchalo ahora!'"
              [variant]="selectedVariant"
              position="top"
            >
              <div class="promo-card-container p-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-cyan-500/10">
                <lib-ui-components-card-premium
                  [variant]="selectedVariant"
                  [config]="config"
                ></lib-ui-components-card-premium>
              </div>
            </lib-ui-components-tooltip>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .promotions-wrapper {
        position: relative;
        overflow: visible;
      }
      
      .promo-card-container {
        cursor: pointer;
      }

      .font-nintendo {
        font-family: 'Press Start 2P', cursive;
      }
    `
  ]
})
export class PromotionsSectionComponent implements OnInit {
  @Input() title: string = 'Ofertas Especiales';
  @Input() description: string = 'Descubre nuestras promociones exclusivas y ahorra en tus tratamientos favoritos.';
  @Input() variant: CardVariant = 'default';
  @Input() premiumCardConfigs: CardPremiumConfig[] = [];
  @Input() selectedVariant: CardVariant | string = 'primary';

  ngOnInit(): void {
    const defaultCard: CardPremiumConfig = {
      title: 'Promoción',
      description: 'Descripción de la oferta especial.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
      price: '29.99€',
      discount: '-20%',
      icon: 'heroStar',
      tooltip: '¡Ahorra con este combo especial!'
    };

    if (!Array.isArray(this.premiumCardConfigs) || this.premiumCardConfigs.length === 0) {
      this.premiumCardConfigs = [
        { ...defaultCard, title: 'Combo Relax', discount: '-25%' },
        { ...defaultCard, title: 'Manicura Pro', discount: 'OFERTA', price: '19.99€' },
        { ...defaultCard, title: 'Tinte & Corte', discount: 'NUEVO', price: '45.00€' }
      ];
    }
  }
}
