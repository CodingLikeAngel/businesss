import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-isolated-mode-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="isolated-mode-section" *ngIf="selectedSection">
      <!-- Isolated Mode Header -->
      <div class="group-title">
        <span class="icon">🎯</span>
        <h4>Modo Aislado Premium</h4>
      </div>

      <p class="description">
        Accede a un editor especializado para {{ sectionLabel }} con funcionalidades avanzadas.
      </p>

      <!-- Button Grid based on section type -->
      <div class="isolated-buttons-grid">
        
        <!-- Pricing Section -->
        <button 
          *ngIf="isPricing" 
          class="isolated-btn premium"
          (click)="openIsolatedMode.emit('pricing')"
        >
          <span class="btn-icon">💎</span>
          <span class="btn-text">
            <strong>Editor de Precios</strong>
            <small>Gestiona planes y suscripciones</small>
          </span>
          <span class="arrow">→</span>
        </button>

        <!-- Promotions Section -->
        <button 
          *ngIf="isPromotions" 
          class="isolated-btn premium"
          (click)="openIsolatedMode.emit('promotions')"
        >
          <span class="btn-icon">🎁</span>
          <span class="btn-text">
            <strong>Editor Promociones</strong>
            <small>Crea ofertas especiales</small>
          </span>
          <span class="arrow">→</span>
        </button>

        <!-- Restaurant/Menu Section -->
        <button 
          *ngIf="isRestaurant" 
          class="isolated-btn premium"
          (click)="openIsolatedMode.emit('restaurant')"
        >
          <span class="btn-icon">🍽️</span>
          <span class="btn-text">
            <strong>Editor de Menú</strong>
            <small>Gestiona cartas y platos</small>
          </span>
          <span class="arrow">→</span>
        </button>

        <!-- Gym/Fitness Section -->
        <button 
          *ngIf="isGym" 
          class="isolated-btn premium"
          (click)="openIsolatedMode.emit('gym')"
        >
          <span class="btn-icon">💪</span>
          <span class="btn-text">
            <strong>Editor Gimnasio</strong>
            <small>Clases y membresías</small>
          </span>
          <span class="arrow">→</span>
        </button>

        <!-- Spa/Wellness Section -->
        <button 
          *ngIf="isSpa" 
          class="isolated-btn premium"
          (click)="openIsolatedMode.emit('spa')"
        >
          <span class="btn-icon">🧘</span>
          <span class="btn-text">
            <strong>Editor Spa</strong>
            <small>Tratamientos y servicios</small>
          </span>
          <span class="arrow">→</span>
        </button>

        <!-- Generic Section (suggest available modes) -->
        <button 
          *ngIf="!hasSpecificMode" 
          class="isolated-btn standard"
          (click)="openIsolatedMode.emit('generic')"
        >
          <span class="btn-icon">✨</span>
          <span class="btn-text">
            <strong>Editor Avanzado</strong>
            <small>Herramientas adicionales</small>
          </span>
          <span class="arrow">→</span>
        </button>

      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="quick-btn" (click)="openIsolatedMode.emit('preview')">
          👁️ Vista Previa
        </button>
        <button class="quick-btn" (click)="openIsolatedMode.emit('duplicate')">
          📋 Duplicar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .isolated-mode-section {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .group-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      
      .icon {
        font-size: 1.2rem;
      }
      
      h4 {
        font-size: 0.85rem;
        font-weight: 700;
        color: #a78bfa;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .description {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 1rem;
      line-height: 1.4;
    }

    .isolated-buttons-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .isolated-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      
      .btn-icon {
        font-size: 1.25rem;
      }
      
      .btn-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        strong {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }
        
        small {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
        }
      }
      
      .arrow {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.4);
        transition: transform 0.2s ease;
      }

      &:hover {
        transform: translateX(4px);
        
        .arrow {
          transform: translateX(4px);
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .isolated-btn.premium {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
      border-color: rgba(139, 92, 246, 0.4);
      
      &:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
        border-color: rgba(139, 92, 246, 0.6);
      }
    }

    .isolated-btn.standard {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    .quick-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .quick-btn {
      flex: 1;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }
  `]
})
export class IsolatedModeTriggerComponent {
  @Input() selectedSection: any = null;
  @Output() openIsolatedMode = new EventEmitter<string>();

  get sectionType(): string {
    return this.selectedSection?.type || '';
  }

  get sectionLabel(): string {
    return this.selectedSection?.label || 'esta sección';
  }

  // Check for specific section types
  get isPricing(): boolean {
    return ['pricing', 'pricing-table', 'pricing-cards', 'plans', 'subscription'].includes(this.sectionType);
  }

  get isPromotions(): boolean {
    return ['promotions', 'promos', 'offers', 'deals', 'special-offers'].includes(this.sectionType);
  }

  get isRestaurant(): boolean {
    return ['restaurant', 'menu', 'food', 'restaurant-menu', 'food-menu', 'carta'].includes(this.sectionType);
  }

  get isGym(): boolean {
    return ['gym', 'fitness', 'gym-classes', 'workout', 'training'].includes(this.sectionType);
  }

  get isSpa(): boolean {
    return ['spa', 'wellness', 'spa-treatments', 'beauty', 'relax'].includes(this.sectionType);
  }

  get hasSpecificMode(): boolean {
    return this.isPricing || this.isPromotions || this.isRestaurant || this.isGym || this.isSpa;
  }
}
