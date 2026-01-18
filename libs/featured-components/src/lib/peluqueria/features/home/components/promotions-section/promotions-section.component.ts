import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UICardPremiumComponent, UIChipComponent, UITooltipComponent, CardVariant, CardPremiumConfig } from '@negocio/ui-components';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'lib-promotions-section',
  standalone: true,
  imports: [CommonModule, UICardPremiumComponent, UIChipComponent, UITooltipComponent],
  templateUrl: './promotions-section.component.html',
  styleUrls: ['./promotions-section.component.scss']
})
export class PromotionsSectionComponent implements OnInit, OnDestroy {
  @Input() variant: CardVariant = 'default';
  @Input() premiumCardConfigs: CardPremiumConfig[] = [];
  @Input() selectedVariant = 'primary';

  countdowns: Countdown[] = [];
  progressValues: number[] = [65, 45, 80]; // Simulated progress
  showConfetti: boolean[] = [false, false, false];
  private intervals: any[] = [];

  ngOnInit() {
    // Ensure we have at least 3 configs to avoid undefined errors in template
    const defaultCard: CardPremiumConfig = {
      title: 'Promoción',
      description: 'Descripción de la oferta especial.',
      image: '',
      price: '0€',
      discount: '0%',
      icon: 'heroStar',
      tooltip: ''
    };

    if (!this.premiumCardConfigs) {
      this.premiumCardConfigs = [];
    }

    while (this.premiumCardConfigs.length < 3) {
      this.premiumCardConfigs.push({ ...defaultCard });
    }

    this.premiumCardConfigs = this.premiumCardConfigs.map((config, index) => ({
      ...config,
      tooltip:
        config?.tooltip || (index === 0
          ? '¡Ahorra con este combo especial!'
          : index === 1
          ? 'Manicura de larga duración.'
          : 'Revitaliza tu cabello hoy.'),
    }));

    // Initialize countdowns
    this.initializeCountdowns();

    // Randomly trigger confetti for demonstration
    setTimeout(() => this.showConfetti[0] = true, 2000);
    setTimeout(() => this.showConfetti[1] = true, 4000);
    setTimeout(() => this.showConfetti[2] = true, 6000);
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private initializeCountdowns() {
    const endTimes = [
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)  // 5 days
    ];

    endTimes.forEach((endTime, index) => {
      this.updateCountdown(index, endTime);
      const interval = setInterval(() => {
        this.updateCountdown(index, endTime);
      }, 1000);
      this.intervals.push(interval);
    });
  }

  private updateCountdown(index: number, endTime: Date) {
    const now = new Date().getTime();
    const distance = endTime.getTime() - now;

    if (distance > 0) {
      this.countdowns[index] = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    } else {
      this.countdowns[index] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  getDetailedTooltip(index: number): string {
    const tooltips = [
      '¡Ahorra hasta 20% en tratamientos faciales y corporales! Incluye limpieza profunda, exfoliación y mascarilla hidratante. Válido para primeras visitas.',
      'Manicura permanente con gel de larga duración. Colores vibrantes disponibles. Incluye diseño personalizado y mantenimiento por 3 semanas.',
      'Tratamiento revitalizante para cabello dañado. Recupera el brillo y la suavidad natural. Ideal para cabello teñido o tratado químicamente.'
    ];
    return tooltips[index] || 'Información detallada no disponible.';
  }
}